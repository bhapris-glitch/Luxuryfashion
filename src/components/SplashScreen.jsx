import React from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-luxury-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-serif gold-text mb-2 tracking-tighter">LAYBOKA</h1>
        <p className="text-luxury-gold tracking-[0.5em] text-xs uppercase">Birth of the Icon</p>
      </motion.div>
      
      <motion.div 
        className="mt-12 w-48 h-[1px] bg-luxury-gold/20 relative overflow-hidden"
      >
        <motion.div 
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-luxury-gold w-1/2"
        />
      </motion.div>
    </motion.div>
  );
}
