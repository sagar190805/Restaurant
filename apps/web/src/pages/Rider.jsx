import { useEffect, useState } from 'react';
import { riderLogin, fetchRiderOrders, updateOrderStatus } from '@/utils/api';


export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [riderId, setRiderId] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('riderToken');
    const userStr = localStorage.getItem('user');
    if (t && userStr) {
      setToken(t);
      const user = JSON.parse(userStr);
      setRiderId(user.id);
      fetchOrders(t);
      setupSocket(t, user.id);
    }
  }, []);

  const setupSocket = (t, rId) => { const bc = new BroadcastChannel('restaurant_events'); bc.onmessage = (e) => { if(e.data.type === 'order:update' && e.data.payload.status === 'OUT_FOR_DELIVERY') { fetchRiderOrders(t).then(setOrders); } }; }; const fetchOrders = async (t) => { const data = await fetchRiderOrders(t); setOrders(data); };

  const handleLogin = async () => { const data = await riderLogin(email, password).catch(() => ({})); if (data.token && data.user?.role === 'RIDER') { localStorage.setItem('riderToken', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setToken(data.token); setRiderId(data.user.id); fetchOrders(data.token); setupSocket(data.token, data.user.id); } else { alert('Login failed'); } }; const updateStatus = async (id, status) => { await updateOrderStatus(id, status, token); setOrders(prev => prev.filter(o => o.id !== id)); }; if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary">Rider Login</h2>
          <input className="w-full border-2 p-3 mb-4 rounded-lg focus:border-primary" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border-2 p-3 mb-6 rounded-lg focus:border-primary" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-primary text-white p-3 rounded-lg font-bold">Login</button>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-primary text-white p-4 shadow-md sticky top-0 flex justify-between items-center">
        <h1 className="text-xl font-bold">Rider App</h1>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span> Online
        </div>
      </header>

      <main className="p-4">
        <h2 className="font-bold text-lg mb-4 text-gray-700">Active Deliveries ({orders.length})</h2>
        {orders.length === 0 ?
        <div className="text-center text-gray-500 mt-10">Waiting for orders...</div> :

        orders.map((order) =>
        <div key={order.id} className="bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg">Order #{order.id.slice(0, 6)}</p>
                  <p className="text-gray-600 text-sm">{order.user.name} • {order.user.phone}</p>
                </div>
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">
                  {order.paymentMethod === 'COD' ? `Collect ₹${order.total / 100}` : 'PAID'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                <p className="font-semibold mb-1">Deliver to:</p>
                {order.address ?
            <p>{order.address.line1}, {order.address.city}</p> :

            <p className="text-red-500">Address not provided</p>
            }
              </div>

              <div className="flex gap-2">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.address?.lat},${order.address?.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-blue-100 text-blue-700 text-center py-3 rounded-lg font-bold border border-blue-200">
                  Navigate
                </a>
                <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold shadow-sm">
                  Delivered
                </button>
              </div>
            </div>
        )
        }
      </main>
    </div>);

}

