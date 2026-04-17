import React, { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Maize Flour (2kg)', price: 200, quantity: 15 },
    { id: 2, name: 'Cooking Oil (1L)', price: 350, quantity: 4 } // Low stock example
  ]);
  const [sales, setSales] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');

  const addProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    const newProd = { id: Date.now(), name, price: Number(price), quantity: Number(qty) };
    setProducts([...products, newProd]);
    setName(''); setPrice(''); setQty('');
  };

  const sellProduct = (id) => {
    setProducts(products.map(p => {
      if (p.id === id && p.quantity > 0) {
        setSales(prev => prev + p.price);
        return { ...p, quantity: p.quantity - 1 };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-12">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">DukaSmart</h1>
          <p className="text-gray-500 font-medium">Retail Management Intelligence</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-blue-100 text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Total Revenue</p>
          <p className="text-3xl font-black text-green-600">KES {sales.toLocaleString()}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Add Product Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Restock Inventory</h2>
          <form onSubmit={addProduct} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">Product Name</label>
              <input className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="e.g. Sugar" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 ml-1">Price</label>
                <input className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" type="number" placeholder="KES" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 ml-1">Qty</label>
                <input className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" type="number" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">Add to Stock</button>
          </form>
        </div>

        {/* Right: Product Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Live Inventory</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-gray-700">{p.name}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">KES {p.price}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${p.quantity < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {p.quantity} UNITS
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => sellProduct(p.id)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">Record Sale</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}