import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', business_name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/register' : '/api/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 luxury-gradient">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-luxury-cream p-10 shadow-2xl rounded-sm"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif mb-2 tracking-tighter">LAYBOKA</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-black/40">The Designer's Suite</p>
        </div>

        {error && <p className="text-red-500 text-xs mb-4 uppercase text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <>
              <input 
                type="text" 
                placeholder="FULL NAME"
                className="w-full bg-transparent border-b border-luxury-black/10 py-2 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                onChange={e => setForm({...form, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="BOUTIQUE NAME"
                className="w-full bg-transparent border-b border-luxury-black/10 py-2 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                onChange={e => setForm({...form, business_name: e.target.value})}
              />
            </>
          )}
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS"
            className="w-full bg-transparent border-b border-luxury-black/10 py-2 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="PASSWORD"
            className="w-full bg-transparent border-b border-luxury-black/10 py-2 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
            onChange={e => setForm({...form, password: e.target.value})}
          />
          
          <button type="submit" className="w-full btn-luxury mt-4">
            {isRegister ? 'Begin Your Legacy' : 'Enter Atelier'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs uppercase tracking-widest text-luxury-black/40">
          {isRegister ? 'Already a resident?' : 'New to the guild?'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="ml-2 text-luxury-gold font-bold hover:underline"
          >
            {isRegister ? 'Login' : 'Join Now'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
