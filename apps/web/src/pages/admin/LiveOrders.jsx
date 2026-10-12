import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Printer, BellRing, AlertCircle, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { API_URL, fetchAdminOrders, updateOrderStatus } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

const STATUSES = ['CREATED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'];

function SortableOrderItem({ order, onStatusChange, onPrint }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, touchAction: 'none' };

  const timeDiff = Math.floor((new Date() - new Date(order.createdAt)) / 60000);
  const isUrgent = timeDiff > 15;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <Card className={`p-4 shadow-sm border-l-4 cursor-grab active:cursor-grabbing ${isUrgent ? 'border-l-red-500' : 'border-l-primary'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className="font-black text-lg">#{order.id.substring(0, 6).toUpperCase()}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isUrgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-primary'}`}>
            {timeDiff}m ago
          </span>
        </div>
        
        <div className="space-y-1 mb-3">
          {order.items?.map((item, i) => (
            <p key={i} className="text-sm font-semibold flex justify-between">
              <span>{item.quantity}x {item.name}</span>
            </p>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <Badge variant="outline">{order.type}</Badge>
          <span className="font-bold">₹{(order.total/100).toFixed(0)}</span>
        </div>

        <div className="flex gap-2">
          {order.status === 'CREATED' && (
            <Button onPointerDown={(e) => e.stopPropagation()} onClick={() => onStatusChange(order.id, 'PREPARING')} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-8">Accept (15m)</Button>
          )}
          {order.status === 'PREPARING' && (
            <Button onPointerDown={(e) => e.stopPropagation()} onClick={() => onStatusChange(order.id, 'READY')} className="flex-1 text-xs h-8">Mark Ready</Button>
          )}
          {order.status === 'READY' && order.type === 'Delivery' && (
            <Button onPointerDown={(e) => e.stopPropagation()} onClick={() => onStatusChange(order.id, 'OUT_FOR_DELIVERY')} className="flex-1 text-xs h-8">Assign Rider</Button>
          )}
          <Button onPointerDown={(e) => e.stopPropagation()} onClick={() => onPrint(order)} variant="outline" size="icon" className="h-8 w-8 shrink-0"><Printer size={14} /></Button>
        </div>
      </Card>
    </div>
  );
}

export default function LiveOrders() {
  const { token } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const audioRef = useRef(null);
  
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // Init Audio
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audioRef.current.loop = true;
  }, []);

  // Fetch initial & socket
  useEffect(() => {
    if (!token) return;
    fetchAdminOrders(token).then(data => {
        if (Array.isArray(data)) setOrders(data.filter(o => STATUSES.includes(o.status)));
      });

    const bc = new BroadcastChannel('restaurant_events');
    

    bc.onmessage = (e) => {
      if (e.data.type === 'order:new') {
        const order = e.data.payload;
        setOrders(prev => [order, ...prev]);
        setNewOrderAlert(true);
        audioRef.current?.play().catch(console.error);
      }
      if (e.data.type === 'order:update') {
        const { orderId, status } = e.data.payload;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    };
    return () => bc.close();
  }, [token]);

  const stopAlert = () => {
    setNewOrderAlert(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
      
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const orderId = active.id;
    const newStatus = over.id; // column id
    const order = orders.find(o => o.id === orderId);

    if (order && order.status !== newStatus && STATUSES.includes(newStatus)) {
      handleStatusChange(orderId, newStatus);
    }
  };

  const printKOT = (order) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>KOT #${order.id.substring(0, 6)}</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 14px; width: 300px; margin: 0 auto; }
            h1 { text-align: center; font-size: 24px; margin: 0 0 10px; }
            .meta { text-align: center; margin-bottom: 20px; font-size: 12px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 16px; }
            .divider { border-top: 2px dashed #000; margin: 15px 0; }
          </style>
        </head>
        <body>
          <h1>KITCHEN ORDER TICKET</h1>
          <div class="meta">
            Order: #${order.id.substring(0, 6).toUpperCase()}<br/>
            Type: ${order.type}<br/>
            Time: ${new Date(order.createdAt).toLocaleTimeString()}
          </div>
          <div class="divider"></div>
          ${order.items.map(i => `<div class="item"><span>${i.quantity}x ${i.name}</span></div>`).join('')}
          <div class="divider"></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  return (
    <div className="h-full flex flex-col relative">
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3 font-black text-lg"><BellRing className="animate-bounce" /> NEW ORDER RECEIVED!</div>
            <Button variant="secondary" onClick={stopAlert} className="font-bold bg-white text-red-600 hover:bg-gray-100">Acknowledge</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto pb-4 pt-4">
          {STATUSES.map(status => {
            const columnOrders = orders.filter(o => o.status === status);
            return (
              <div key={status} id={status} className="w-80 shrink-0 flex flex-col bg-muted/50 rounded-2xl p-4 border border-border">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-black text-sm">{status.replace(/_/g, ' ')}</h3>
                  <Badge variant="outline" className="bg-card font-black">{columnOrders.length}</Badge>
                </div>
                
                <SortableContext items={columnOrders.map(o => o.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 space-y-3 min-h-[200px]">
                    {columnOrders.map(order => (
                      <SortableOrderItem key={order.id} order={order} onStatusChange={handleStatusChange} onPrint={printKOT} />
                    ))}
                    {columnOrders.length === 0 && (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                        <span className="text-muted-foreground text-sm font-semibold">Drop here</span>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}





