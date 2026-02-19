'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-100 tracking-tight mb-2"
            style={{ 
              fontFamily: '"Courier New", monospace',
              textShadow: '0 0 20px rgba(255, 170, 0, 0.3)'
            }}
          >
            VANGUARD
            <span className="text-orange-500"> BLINDSIDE</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-zinc-500 text-sm md:text-base mb-8 tracking-widest uppercase"
          >
            1v1 Tactical Zero-Knowledge Warfare
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <button
              className="group relative px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-orange-500 transition-all duration-300 rounded-sm overflow-hidden"
              style={{ boxShadow: '0 0 15px rgba(255, 170, 0, 0.1)' }}
            >
              <span className="relative z-10 text-zinc-100 font-bold tracking-wider uppercase text-sm group-hover:text-orange-500 transition-colors">
                Create Game
              </span>
              <div className="absolute inset-0 bg-orange-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>

            <button
              className="group relative px-8 py-4 bg-transparent border-2 border-zinc-700 hover:border-zinc-500 transition-all duration-300 rounded-sm"
            >
              <span className="text-zinc-400 font-bold tracking-wider uppercase text-sm group-hover:text-zinc-200 transition-colors">
                Join Game
              </span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.5 : 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center gap-2 text-zinc-600 text-xs"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>SERVERS ONLINE</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg" />
          <div className="relative border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
            <GameCanvas />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.6 : 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute -bottom-4 -right-4 text-zinc-700 text-xs font-mono"
          >
            BATTLEFIELD PREVIEW
          </motion.div>
        </motion.div>

      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.03 : 0 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
