import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-luxury-cream/80 backdrop-blur-md border-b border-luxury-black/5 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="font-serif text-2xl tracking-tighter cursor-pointer">LAYBOKA</h1>
        <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-bold">
          <a href="#" className="hover:text-luxury-gold">Orders</a>
          <a href="#" className="hover:text-luxury-gold">Clients</a>
          <a href="#" className="hover:text-luxury-gold">Inventory</a>
          <a href="#" className="hover:text-luxury-gold">Analytics</a>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{user.business_name}</span>
          <div className="w-8 h-8 bg-luxury-black flex items-center justify-center rounded-full text-luxury-gold">
            <User size={16} />
          </div>
        </div>
        <button onClick={onLogout} className="text-luxury-black/60 hover:text-luxury-black">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
