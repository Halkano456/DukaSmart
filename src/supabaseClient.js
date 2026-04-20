import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. STATE MANAGEMENT
  const [role, setRole] = useState('Admin'); 
  const [isDark, setIsDark] = useState(true);
  const [logs, setLogs] = useState([]);
  const [inventory] = useState([
    { id: 1, name: 'Kibao Vodka', stock: 5, price: 1200, expiry: '2026-05-20', batch: 'B-901' },
    { id: 2, name: 'Indomie Pack', stock: 50, price: 45, expiry: '2026-12-01', batch: 'B-202' },
    { id: 3, name: 'Safari Airtime', stock: 100, price: 100, expiry: 'N/A', batch: 'DIG-01' }
  ]);

  // 2. THEME TOGGLE EFFECT
  useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [isDark]);

  // 3. AUDIT LOG FUNCTION
  const addLog = (action) => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      user: role,
      action: action
    };
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 5));
  };

  // 4. WHATSAPP ORDER LOGIC
  const orderViaWhatsApp = (item) => {
    const phone = "254700000000"; 
    const text = `*DukaSmart Purchase Order*%0AItem: ${item.name}%0ABatch: ${item.batch}%0AStock is Low (${item.stock} left). Requesting Restock.`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    addLog(`Sent WhatsApp PO for ${item.name}`);
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <span style={{color: 'var(--accent)'}}>✦</span> DukaSmart
        </div>
        <nav style={{flex: 1}}>
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item" onClick={() => addLog('Viewed Inventory')}>Inventory</button>
          <button className="nav-item" onClick={() => addLog('Viewed Reports')}>Reports</button>
          {role === 'Admin' && (
            <button className="nav-item" onClick={() => addLog('Accessed Security')}>Security</button>
          )}
        </nav>
        
        <div style={{borderTop: '1px solid var(--border)', paddingTop: '20px'}}>
            <p className="stat-label" style={{marginBottom: '10px'}}>User Access Level</p>
            <select 
              value={role} 
              onChange={(e) => {
                setRole(e.target.value);
                addLog(`Changed role to ${e.target.value}`);
              }} 
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '8px', 
                background: 'var(--bg-app)', 
                color: 'var(--text-main)',
                border: '1px solid var(--border)'
              }}
            >
                <option>Admin</option>
                <option>Manager</option>
                <option>Cashier</option>
            </select>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-wrap">
        <header className="top-nav">
          <h2 style={{fontSize: '1.2rem'}}>Kiosk Command Center</h2>
          <button 
            onClick={() => setIsDark(!isDark)} 
            style={{
              padding: '8px 16px', 
              borderRadius: '20px', 
              border: '1px solid var(--border)', 
              background: 'var(--bg-panel)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        <div className="dashboard-grid">
          {/* STAT CARDS */}
          <div className="card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-val">KES 45,670</p>
            {role === 'Admin' ? (
              <p style={{color: 'var(--success)', fontSize: '0.85rem'}}>Profit: KES 12,300</p>
            ) : (
              <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Hidden for {role}</p>
            )}
          </div>

          <div className="card">
            <p className="stat-label">Active Coupons</p>
            <p className="stat-val">4</p>
            <p style={{fontSize: '0.85rem'}}>Happy Hour at 17:00</p>
          </div>

          <div className="card">
            <p className="stat-label">Stock Alerts</p>
            <p className="stat-val" style={{color: 'var(--danger)'}}>2 Items</p>
            <p style={{fontSize: '0.85rem'}}>Critical restock needed</p>
          </div>

          <div className="card">
            <p className="stat-label">Loyalty Points</p>
            <p className="stat-val">1,240</p>
            <p style={{fontSize: '0.85rem'}}>Across 12 customers</p>
          </div>

          {/* INVENTORY TABLE */}
          <div className="card table-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{fontSize: '1.1rem'}}>Stock & Logistics</h3>
                <button 
                  className="btn-wa" 
                  style={{background: 'var(--accent)'}}
                  onClick={() => addLog('Generated PDF Report')}
                >
                  Export Data
                </button>
            </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Batch ID</th>
                  <th>Stock Status</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td><code style={{color: 'var(--text-muted)'}}>{item.batch}</code></td>
                    <td>
                        <span className={`badge ${item.stock < 10 ? 'red' : 'green'}`}>
                            {item.stock} Units
                        </span>
                    </td>
                    <td>{item.expiry}</td>
                    <td>
                      {item.stock < 10 && (
                        <button className="btn-wa" onClick={() => orderViaWhatsApp(item)}>
                          Order Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AUDIT LOG PANEL */}
          <div className="audit-panel">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
              <h3 style={{fontSize: '1rem'}}>Security Audit Logs</h3>
              <span className="badge green" style={{fontSize: '0.6rem'}}>Live Feed</span>
            </div>
            <div style={{marginTop: '10px'}}>
              {logs.length === 0 ? (
                <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Waiting for system activity...</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="log-entry">
                    <span style={{color: 'var(--accent)', fontWeight: '600'}}>[{log.time}]</span> 
                    <strong style={{marginLeft: '8px'}}>{log.user}</strong>: {log.action}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;