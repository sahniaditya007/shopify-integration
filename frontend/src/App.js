import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from your backend API
    fetch('http://localhost:3001/api/dashboard-metrics')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // The empty array ensures this effect runs only once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Shopify Insights Dashboard</h1>
        <div className="metrics-container">
          <div className="metric-card">
            <h2>Total Revenue</h2>
            <p>${Number(metrics.totalRevenue).toFixed(2)}</p>
          </div>
          <div className="metric-card">
            <h2>Total Orders</h2>
            <p>{metrics.totalOrders}</p>
          </div>
          <div className="metric-card">
            <h2>Total Customers</h2>
            <p>{metrics.totalCustomers}</p>
          </div>
        </div>
        <div className="top-customers">
          <h2>Top 5 Customers by Spend</h2>
          <ul>
            {metrics.topCustomers.map(customer => (
              <li key={customer.id}>
                {customer.firstName} {customer.lastName} - ${Number(customer.totalSpent).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;