import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown } from 'lucide-react';

export default function AppLock() {
  const handleUpgrade = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const session = await res.json();
    window.location.href = `https://checkout.stripe.com/c/pay/${session.id}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-luxury-charcoal border border-luxury-gold/30 p-10 text-center rounded-sm shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full border border-luxury-gold bg-luxury-gold/10">
            <Lock className="text-luxury-gold" size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-serif gold-text mb-4">Trial Period Concluded</h2>
        <p className="text-luxury-cream/70 mb-8 text-sm leading-relaxed">
          Your 7-day exclusive access to the Layboka suite has expired. To continue crafting masterpieces and managing your fashion empire, please activate your professional subscription.
        </p>
        
        <button 
          onClick={handleUpgrade}
          className="w-full btn-luxury flex items-center justify-center gap-3"
        >
          <Crown size={18} />
          Activate Full Access
        </button>
        
        <p className="mt-6 text-[10px] text-luxury-gold/40 uppercase tracking-widest">
          Secure Global Payments powered by Stripe
        </p>
      </div>
    </motion.div>
  );
}
