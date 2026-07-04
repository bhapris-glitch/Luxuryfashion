import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Scissors, TrendingUp, Sparkles } from 'lucide-react';

export default function Dashboard({ subStatus }) {
  const [stats, setStats] = useState({ orders: [], customers: [] });

  useEffect(() => {
    fetch('/api/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setStats(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif mb-2">The Atelier</h1>
          <p className="text-luxury-black/60 italic">Welcome back to your creative sanctuary.</p>
        </div>
        {subStatus?.status === 'trial' && (
          <div className="bg-luxury-gold/10 border border-luxury-gold/20 px-4 py-2 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
              {subStatus.remainingDays} Days Left in Trial
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Scissors />} label="Active Orders" value={stats.orders.length} />
        <StatCard icon={<Users />} label="Client Base" value={stats.customers.length} />
        <StatCard icon={<TrendingUp />} label="Revenue (Est)" value="$12,450" />
        <StatCard icon={<Sparkles />} label="AI Fabric Mood" value="Silk Velvet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-luxury-black/5 p-8 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl italic">Birth of a Dress: Active Timeline</h3>
            <button className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:text-luxury-gold transition-colors">
              <Plus size={14} /> New Order
            </button>
          </div>
          
          <div className="space-y-6">
            {stats.orders.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-luxury-black/5">
                <p className="text-sm text-luxury-black/40">No garments currently in production.</p>
              </div>
            ) : (
              stats.orders.map(order => (
                <div key={order.id} className="border-b border-luxury-black/5 pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order #{order.id}</span>
                    <span className="text-xs text-luxury-black/40 uppercase tracking-widest">{order.deadline}</span>
                  </div>
                  <div className="w-full bg-luxury-cream h-1.5 rounded-full overflow-hidden">
                    <div className="bg-luxury-gold h-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-luxury-black text-luxury-gold p-8 rounded-sm shadow-xl">
          <h3 className="font-serif text-xl italic mb-6">Fabric AI Assistant</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-sm text-sm">
              <p className="italic mb-2 opacity-80">Suggest a fabric for a summer gala in Mumbai.</p>
              <p className="text-luxury-cream">"Consider a lightweight **Mulberry Silk** with a **Chanderi** weave. It offers breathability while maintaining a royal sheen suitable for humid luxury environments."</p>
            </div>
            <button className="w-full py-3 border border-luxury-gold text-[10px] uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-luxury-black transition-all">
              Consult Fabric AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 border border-luxury-black/5 rounded-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="text-luxury-gold">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-luxury-black/40">{label}</p>
        <p className="text-xl font-serif">{value}</p>
      </div>
    </div>
  );
}
