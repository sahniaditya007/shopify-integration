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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 font-sans animate-fadein">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 drop-shadow-lg tracking-tight">Shopify Analytics Dashboard</h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300 border-t-4 border-blue-400">
              <div className="text-4xl font-bold text-blue-700 mb-2 animate-fadein-slow">{metrics.totalCustomers}</div>
              <div className="text-gray-500 text-lg">Total Customers</div>
            </div>
            <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300 border-t-4 border-green-400">
              <div className="text-4xl font-bold text-green-700 mb-2 animate-fadein-slow">{metrics.totalOrders}</div>
              <div className="text-gray-500 text-lg">Total Orders</div>
            </div>
            <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300 border-t-4 border-purple-400">
              <div className="text-4xl font-bold text-purple-700 mb-2 animate-fadein-slow">${metrics.totalRevenue}</div>
              <div className="text-gray-500 text-lg">Total Revenue</div>
            </div>
          </div>
        )}

        <div className="bg-white/90 rounded-2xl shadow-lg p-8 mb-12 animate-fadein">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2"><span className="inline-block w-2 h-6 bg-blue-400 rounded-full"></span> Orders by Date</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
            />
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
            />
            <button
              onClick={handleFilter}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Filter
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-base bg-white rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <th className="px-6 py-3 text-left font-semibold text-blue-700">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-green-700">Orders</th>
                  <th className="px-6 py-3 text-left font-semibold text-purple-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {ordersByDate.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-gray-400 py-6">No data</td></tr>
                ) : (
                  ordersByDate.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-3">{row.date}</td>
                      <td className="px-6 py-3">{row.orders}</td>
                      <td className="px-6 py-3">${row.revenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-lg p-8 animate-fadein">
          <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span className="inline-block w-2 h-6 bg-purple-400 rounded-full"></span> Top 5 Customers by Spend</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-base bg-white rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <th className="px-6 py-3 text-left font-semibold text-purple-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-blue-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-pink-700">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {metrics && metrics.topCustomers && metrics.topCustomers.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-gray-400 py-6">No data</td></tr>
                ) : (
                  metrics && metrics.topCustomers && metrics.topCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-3">{c.firstName} {c.lastName}</td>
                      <td className="px-6 py-3">{c.email}</td>
                      <td className="px-6 py-3">${c.totalSpent}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: none; }
          }
          .animate-fadein { animation: fadein 0.8s cubic-bezier(.4,0,.2,1) both; }
          .animate-fadein-slow { animation: fadein 1.5s cubic-bezier(.4,0,.2,1) both; }
        `}</style>
      </div>
    </div>
  );
}
