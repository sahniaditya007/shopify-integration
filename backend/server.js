// Utility to recursively convert BigInt to Number
function convertBigIntToNumber(obj) {
    if (typeof obj === 'bigint') return Number(obj);
    if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
    if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, convertBigIntToNumber(v)])
        );
    }
    return obj;
}
// --- Shopify Ingestion Server ---
require('@shopify/shopify-api/adapters/node');
require('dotenv').config();
const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { PrismaClient } = require('@prisma/client');

const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const prisma = new PrismaClient();

// --- Your main data ingestion endpoint ---
app.get('/api/ingest', async (req, res) => {
    // Use environment variables for secrets
    const SHOP = process.env.SHOPIFY_SHOP;
    const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

    try {
        // Initialize the Shopify API library
        const shopify = shopifyApi({
            apiKey: process.env.SHOPIFY_API_KEY,
            apiSecretKey: process.env.SHOPIFY_API_SECRET,
            apiVersion: LATEST_API_VERSION,
            isEmbeddedApp: false,
            hostName: 'localhost',
            adminApiAccessToken: ACCESS_TOKEN,
        });
        
        // Create a new session for the API client
        const session = {
            id: 'ingest-session',
            shop: SHOP,
            state: 'ingest',
            isOnline: false,
            accessToken: ACCESS_TOKEN,
            scope: 'read_products,read_customers,read_orders',
        };

        // Create a REST client from the session
        const client = new shopify.clients.Rest({ session });

        // 1. Find or create the store in your database
        const store = await prisma.store.upsert({
            where: { shop: SHOP },
            update: { accessToken: ACCESS_TOKEN },
            create: { shop: SHOP, accessToken: ACCESS_TOKEN },
        });
        console.log(`Operating on store: ${store.shop}`);


        // --- 1. PRODUCT INGESTION ---
        const productsResponse = await client.get({ path: 'products' });
        const products = productsResponse.body.products;
        for (const product of products) {
            await prisma.product.upsert({
                where: { id: product.id },
                update: { title: product.title, vendor: product.vendor },
                create: {
                    id: product.id,
                    title: product.title,
                    vendor: product.vendor,
                    tenantId: store.id,
                },
            });
        }
        console.log(`Successfully saved ${products.length} products.`);

        // --- 2. CUSTOMER INGESTION ---
        const customersResponse = await client.get({ path: 'customers' });
        const customers = customersResponse.body.customers;
        for (const customer of customers) {
            await prisma.customer.upsert({
                where: { id: customer.id },
                update: {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    email: customer.email,
                    totalSpent: customer.total_spent,
                },
                create: {
                    id: customer.id,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    email: customer.email,
                    totalSpent: customer.total_spent,
                    tenantId: store.id,
                },
            });
        }
        console.log(`Successfully saved ${customers.length} customers.`);

        // --- 3. ORDER INGESTION ---
        const ordersResponse = await client.get({ path: 'orders' });
        const orders = ordersResponse.body.orders;
        for (const order of orders) {
            await prisma.order.upsert({
                where: { id: order.id },
                update: {
                    totalPrice: order.total_price,
                    customerId: order.customer ? order.customer.id : null,
                },
                create: {
                    id: order.id,
                    totalPrice: order.total_price,
                    customerId: order.customer ? order.customer.id : null,
                    tenantId: store.id,
                },
            });
        }
        console.log(`Successfully saved ${orders.length} orders.`);

        const successMessage = `Ingested ${products.length} products, ${customers.length} customers, and ${orders.length} orders.`;
        res.status(200).json({ status: 'success', message: successMessage });

    } catch (error) {
        console.error('Error during data ingestion:', error);
        res.status(500).json({ status: 'error', message: 'Failed to ingest data.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/api/dashboard-metrics', async (req, res) => {
    // For now, we are hardcoding the store ID. We will make this dynamic later.
    const storeId = 1; 

    try {
        // Get total counts

        const totalCustomers = await prisma.customer.count({ where: { tenantId: storeId } });
        const totalOrders = await prisma.order.count({ where: { tenantId: storeId } });

        // Calculate total revenue
        const revenueAggregation = await prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { tenantId: storeId },
        });
        // Convert BigInt to Number (or 0)
        const totalRevenue = revenueAggregation._sum.totalPrice ? Number(revenueAggregation._sum.totalPrice) : 0;

        // Get top 5 customers by spend
        let topCustomers = await prisma.customer.findMany({
            where: { tenantId: storeId },
            orderBy: { totalSpent: 'desc' },
            take: 5,
        });
        // Convert BigInt totalSpent to Number for each customer
        topCustomers = topCustomers.map(c => ({
            ...c,
            totalSpent: c.totalSpent ? Number(c.totalSpent) : 0
        }));

        const response = {
            totalCustomers,
            totalOrders,
            totalRevenue,
            topCustomers,
        };
        res.status(200).json(convertBigIntToNumber(response));

    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch metrics.' });
    }
});