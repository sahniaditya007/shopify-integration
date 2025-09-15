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
    <div className="min-h-screen px-6 py-10 md:py-14 font-sans animate-fadein text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight">Shopify Analytics</h1>
          <button onClick={fetchMetrics} className="btn-modern btn-invert">Refresh</button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-40 opacity-80">
            <svg className="animate-spin h-8 w-8 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card-modern text-center">
              <div className="text-4xl font-bold mb-1">{metrics.totalCustomers}</div>
              <div className="text-zinc-400 text-sm">Total Customers</div>
            </div>
            <div className="card-modern text-center">
              <div className="text-4xl font-bold mb-1">{metrics.totalOrders}</div>
              <div className="text-zinc-400 text-sm">Total Orders</div>
            </div>
            <div className="card-modern text-center">
              <div className="text-4xl font-bold mb-1">${metrics.totalRevenue}</div>
              <div className="text-zinc-400 text-sm">Total Revenue</div>
            </div>
          </div>
        )}

        <section className="glass p-6 rounded-xl mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white/90">Orders by Date</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
                className="bg-transparent border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              />
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
                className="bg-transparent border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              />
              <button onClick={handleFilter} className="btn-modern">Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-base rounded-lg">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {ordersByDate.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-zinc-500 py-6">No data</td></tr>
                ) : (
                  ordersByDate.map((row, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="px-6 py-3">{row.date}</td>
                      <td className="px-6 py-3">{row.orders}</td>
                      <td className="px-6 py-3">${row.revenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white/90 mb-6">Top 5 Customers by Spend</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-base rounded-lg">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {metrics && metrics.topCustomers && metrics.topCustomers.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-zinc-500 py-6">No data</td></tr>
                ) : (
                  metrics && metrics.topCustomers && metrics.topCustomers.map((c, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="px-6 py-3">{c.firstName} {c.lastName}</td>
                      <td className="px-6 py-3">{c.email}</td>
                      <td className="px-6 py-3">${c.totalSpent}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
