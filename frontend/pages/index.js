import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchOrdersByDate();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:3001/api/dashboard-metrics');
    const data = await res.json();
    setMetrics(data);
    setLoading(false);
  };

  const fetchOrdersByDate = async (from, to) => {
    let url = 'http://localhost:3001/api/orders-by-date';
    if (from && to) url += `?from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrdersByDate(data.orders || []);
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchOrdersByDate(dateRange.from, dateRange.to);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Shopify Dashboard</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-semibold text-blue-600">{metrics.totalCustomers}</div>
              <div className="text-gray-500">Total Customers</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-semibold text-green-600">{metrics.totalOrders}</div>
              <div className="text-gray-500">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-semibold text-purple-600">${metrics.totalRevenue}</div>
              <div className="text-gray-500">Total Revenue</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Orders by Date</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Orders</th>
                  <th className="px-4 py-2 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {ordersByDate.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-gray-400 py-4">No data</td></tr>
                ) : (
                  ordersByDate.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">{row.orders}</td>
                      <td className="px-4 py-2">${row.revenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Top 5 Customers by Spend</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {metrics && metrics.topCustomers && metrics.topCustomers.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-gray-400 py-4">No data</td></tr>
                ) : (
                  metrics && metrics.topCustomers && metrics.topCustomers.map((c, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">${c.totalSpent}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
