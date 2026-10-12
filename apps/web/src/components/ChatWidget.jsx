import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BOT_REPLIES = {
  'hi': 'Hello! 👋 How can I help you today? You can ask me about our menu, delivery, or track your order.',
  'hello': 'Hello! 👋 Welcome to Spice Route! How can I help you?',
  'menu': 'Here\'s our menu: /menu 🍛 We have Starters, Main Course, Biryani, Breads, Desserts, and Drinks!',
  'delivery': 'We deliver within 7km radius. Free delivery above ₹499. Estimated time: 30-45 minutes! 🛵',
  'track': 'To track your order, go to /track and enter your Order ID + mobile number.',
  'hours': 'We\'re open every day from 11:00 AM to 11:30 PM 🕐',
  'phone': 'You can call us at +91 98765 43210 📞',
  'default': 'I\'m not sure about that! Please call us at +91 98765 43210 or email hello@spiceroute.in for help.',
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (lower.includes(key)) return reply;
  }
  return BOT_REPLIES.default;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: '👋 Hi! I\'m Spice Route\'s assistant. Ask me anything about orders, menu, or delivery!' }]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getBotReply(userMsg) }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🍛</div>
              <div>
                <p className="font-bold text-sm">Spice Route Bot</p>
                <p className="text-xs opacity-80">● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-72">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.from === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-border">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type your message..." className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none" />
              <button onClick={send} className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}