import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const App = () => {
  // --- STATE MANAGEMENT ---
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Indomie Pack', stock: 12, price: 50, category: 'Snacks', expiry: '2026-05-13' },
    { id: 2, name: 'Kibao Vodka', stock: 8, price: 1200, category: 'Beverages', expiry: '2026-06-14' },
    { id: 3, name: 'Safari Airtime', stock: 110, price: 100, category: 'Essentials', expiry: '2027-01-01' },
  ]);

  const [sales, setSales] = useState([
    { id: 'TXN-120394', name: 'Safari Airtime', qty: 2, time: '11:45 AM', price: 200 },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', stock: '', price: '', category: 'General', expiry: '' });

  // --- ANALYTICS ---
  const totalRevenue = useMemo(() => sales.reduce((acc, curr) => acc + curr.price, 0), [sales]);
  const inventoryValue = useMemo(() => inventory.reduce((acc, curr) => acc + (curr.price * curr.stock), 0), [inventory]);
  const lowStockItems = inventory.filter(i => i.stock < 10).length;

  // --- CORE FUNCTIONS ---
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      stock: parseInt(formData.stock),
      price: parseInt(formData.price),
      category: formData.category,
      expiry: formData.expiry || 'N/A'
    };
    setInventory([...inventory, newProduct]);
    setIsModalOpen(false); // Close Modal
    setFormData({ name: '', stock: '', price: '', category: 'General', expiry: '' }); // Reset Form
  };

  const handleSell = (item) => {
    if (item.stock <= 0) return alert("Product out of stock!");
    setInventory(prev => prev.map(i => i.id === item.id ? { ...i, stock: i.stock - 1 } : i));
    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      name: item.name,
      qty: 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: item.price
    };
    setSales(prev => [newTxn, ...prev]);
  };

  // --- CHART CONFIG ---
  const lineData = {
    labels: ['12/20', '12/22', '12/24', '12/26', '12/28', '12/30'],
    datasets: [{
      data: [10, 18, 12, 16, 28, 22],
      borderColor: '#38bdf8',
      borderWidth: 3,
      fill: true,
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      tension: 0.4,
    }]
  };

  return (
    <div className="pos-shell">
      <header className="header-master">
        <div className="branding">
          <div className="brand-box">🏪</div>
          <h1>DukaSmart</h1>
        </div>
        <div className="header-meta">
          <div className="profile-badge">Admin ▼</div>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="kpi-container">
          <div className="glass-card kpi blue-glow">
            <label>Total Revenue <span className="live-chip">Live</span></label>
            <h2>KES {totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="glass-card kpi">
            <label>Inventory Value</label>
            <h2>KES {inventoryValue.toLocaleString()}</h2>
          </div>
          <div className="glass-card kpi alert-critical">
            <label>Low Stock Alerts</label>
            <h2 className="neon-red">{lowStockItems} Alerts</h2>
          </div>
          <div className="glass-card kpi">
            <label>Today's Sales</label>
            <h2>KES 32,450</h2>
          </div>
        </section>

        <section className="analytics-container">
          <div className="glass-card main-chart">
            <h3>Sales Overview</h3>
            <div className="chart-box">
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="glass-card distribution">
            <h3>Category Split</h3>
            <Doughnut 
              data={{
                labels: ['Bev', 'Snack', 'Ess'],
                datasets: [{ data: [350, 120, 200], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0 }]
              }} 
              options={{ cutout: '75%' }} 
            />
          </div>
        </section>

        <section className="management-container">
          <div className="glass-card table-section">
            <div className="card-top">
              <h3>Inventory Management</h3>
              <button className="btn-solid" onClick={() => setIsModalOpen(true)}>+ Add Product</button>
            </div>
            <div className="table-responsive">
              <table className="pos-table">
                <thead>
                  <tr><th>Product</th><th>Stock</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className={item.stock < 10 ? 'red-text' : ''}>{item.stock}</td>
                      <td>{item.price}</td>
                      <td>
                        <button className="btn-sm-sell" onClick={() => handleSell(item)}>Sell</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card txn-section">
            <h3>Recent Transactions</h3>
            <div className="txn-feed">
              {sales.slice(0, 6).map(s => (
                <div key={s.id} className="txn-card">
                  <div className="txn-body">
                    <strong>{s.id}</strong>
                    <small>{s.name}</small>
                  </div>
                  <span className="time">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- ADD PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="form-row">
                <input type="number" placeholder="Initial Stock" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                <input type="number" placeholder="Price (KES)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <input type="text" placeholder="Category (e.g. Snacks)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <input type="date" placeholder="Expiry Date" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
              <div className="modal-actions">
                <button type="submit" className="btn-solid">Save to Inventory</button>
                <button type="button" className="btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;