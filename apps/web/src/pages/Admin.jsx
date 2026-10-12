import React, { useState, useEffect } from 'react';
import { fetchMenu, toggleMenuItemStock, fetchSettings, updateSettings, updateMenuItem } from '@/utils/api';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, Users, Bike, Bell, Menu as MenuIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LiveOrders from './admin/LiveOrders';

const mockData = [
  { name: '10 AM', sales: 4000 },
  { name: '12 PM', sales: 12000 },
  { name: '2 PM', sales: 8000 },
  { name: '4 PM', sales: 3000 },
  { name: '6 PM', sales: 15000 },
  { name: '8 PM', sales: 25000 },
  { name: '10 PM', sales: 18000 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpen, setIsOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenu().then(data => {
      const items = [];
      data.forEach(cat => {
        cat.items.forEach(i => items.push({...i, category: cat.name}));
      });
      setMenuItems(items);
    });
    fetchSettings().then(sets => {
      if (sets) setIsOpen(sets.isOpen);
    });
  }, []);

  const handleToggleStoreStatus = async () => {
    const newState = !isOpen;
    setIsOpen(newState);
    await updateSettings({ isOpen: newState });
  };

  const handleToggleStock = async (id) => {
    await toggleMenuItemStock(id);
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, inStock: item.inStock === false ? true : false } : item));
  };

  const handleEditItem = async (itm) => {
    const newPriceStr = window.prompt('Enter new price (in Rupees):', (itm.price / 100).toFixed(2));
    if (newPriceStr !== null) {
      const newPrice = parseFloat(newPriceStr);
      if (!isNaN(newPrice) && newPrice >= 0) {
        const priceInCents = Math.round(newPrice * 100);
        await updateMenuItem(itm.id, { price: priceInCents });
        setMenuItems(prev => prev.map(item => item.id === itm.id ? { ...item, price: priceInCents } : item));
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-black font-serif text-primary">Spice Route</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Partner Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
            { id: 'menu', label: 'Menu Manager', icon: UtensilsCrossed },
            { id: 'riders', label: 'Riders', icon: Bike },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600"><MenuIcon /></button>
            <h2 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600">Store Status:</span>
              <button 
                onClick={handleToggleStoreStatus}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-bold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>{isOpen ? 'Accepting Orders' : 'Closed'}</span>
            </div>
            
            <button className="relative text-gray-600 hover:text-primary transition-colors">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Today's Sales", value: '₹42,500', trend: '+12%' },
                  { label: 'Orders', value: '124', trend: '+5%' },
                  { label: 'Avg Order Value', value: '₹342', trend: '-2%' },
                  { label: 'Cancellations', value: '3', trend: '0%' },
                ].map(kpi => (
                  <Card key={kpi.label} className="p-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-2">{kpi.label}</h3>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-black">{kpi.value}</span>
                      <Badge className={kpi.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>{kpi.trend}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Chart */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-6 font-serif">Sales Trend (Today)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#ff5200" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <LiveOrders />
          )}          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black font-serif">Menu Manager</h2>
                <Button>+ Add New Item</Button>
              </div>
              <Card className="p-0 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr><th className="p-4 font-bold">Item</th><th className="p-4 font-bold">Category</th><th className="p-4 font-bold">Price</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold text-right">Actions</th></tr>
                  </thead>
                                    <tbody className="divide-y divide-gray-100">
                    {menuItems.map((itm) => (
                      <tr key={itm.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold">{itm.name}</td>
                        <td className="p-4 text-gray-500">{itm.category}</td>
                        <td className="p-4 font-semibold">&#8377;{(itm.price/100).toFixed(2)}</td>
                        <td className="p-4 cursor-pointer" onClick={() => handleToggleStock(itm.id)}>
                          <Badge className={itm.inStock !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}>{itm.inStock !== false ? 'In Stock' : 'Out of Stock'}</Badge>
                        </td>
                        <td className="p-4 text-right"><Button onClick={() => handleEditItem(itm)} variant="outline" size="sm">Edit</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'riders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-serif">Active Riders</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Raju Bhai', status: 'On Delivery', orders: 4, phone: '+91 9876543210', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Ramesh K.', status: 'Idle', orders: 12, phone: '+91 9876543211', color: 'bg-green-100 text-green-700' },
                  { name: 'Suresh M.', status: 'Offline', orders: 8, phone: '+91 9876543212', color: 'bg-gray-100 text-gray-700' }
                ].map((r, i) => (
                  <Card key={i} className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-2xl">??</div>
                    <h3 className="font-black text-lg">{r.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{r.phone}</p>
                    <Badge className={r.color + ' mb-4'}>{r.status}</Badge>
                    <div className="w-full flex justify-between text-sm font-semibold border-t pt-4 border-gray-100">
                      <span className="text-gray-500">Today's Deliveries:</span>
                      <span>{r.orders}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-serif">Recent Customers</h2>
              <Card className="p-0 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr><th className="p-4 font-bold">Name</th><th className="p-4 font-bold">Contact</th><th className="p-4 font-bold">Total Orders</th><th className="p-4 font-bold">Last Order</th></tr>
                  </thead>
                                                      <tbody className="divide-y divide-gray-100">
                    {[{n:'Rahul Sharma', p:'+91 9999988888', o:14, d:'Today, 2:30 PM'}, {n:'Priya Singh', p:'+91 8888877777', o:5, d:'Yesterday'}, {n:'Amit Patel', p:'+91 7777766666', o:22, d:'2 Days Ago'}].map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold flex items-center gap-3"><div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">{c.n[0]}</div>{c.n}</td>
                        <td className="p-4 text-gray-500">{c.p}</td>
                        <td className="p-4 font-semibold">{c.o} Orders</td>
                        <td className="p-4 text-gray-500">{c.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black mb-6 font-serif">Appearance & Themes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'default', name: 'Zomato Glass', color: 'bg-red-500' },
                    { id: 'saffron', name: 'Classic Saffron', color: 'bg-orange-500' },
                  { id: 'midnight', name: 'Midnight Gold', color: 'bg-slate-900' },
                  { id: 'fresh-green', name: 'Fresh Green', color: 'bg-green-600' },
                  { id: 'royal-maroon', name: 'Royal Maroon', color: 'bg-rose-800' },
                    { id: 'ocean-breeze', name: 'Ocean Breeze', color: 'bg-blue-500' },
                    { id: 'spicy-red', name: 'Spicy Red', color: 'bg-red-600' },
                    { id: 'pastel-pop', name: 'Pastel Pop', color: 'bg-pink-400' },
                    { id: 'monochrome', name: 'Monochrome', color: 'bg-black' },
                ].map(theme => (
                  <Card 
                    key={theme.id}
                    onClick={() => document.documentElement.setAttribute('data-theme', theme.id)}
                    className="p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-full ${theme.color} shadow-inner`} />
                    <span className="font-bold text-lg">{theme.name}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
















