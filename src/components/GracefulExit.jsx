import React from 'react';
import { motion } from 'framer-motion';

export default function GracefulExit() {
  return (
    <div className="fixed inset-0 z-50 bg-luxury-black flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-serif text-luxury-gold italic mb-4">Until we create again...</h2>
        <p className="text-luxury-cream/50 text-xs tracking-widest uppercase">Graceful Exit by Layboka</p>
      </motion.div>
    </div>
  );
}
