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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Noise texture overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.03 : 0 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Panel - UI */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left z-10"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-100 tracking-tight mb-2"
            style={{ 
              fontFamily: '"Courier New", monospace',
              textShadow: '0 0 30px rgba(255, 170, 0, 0.4), 0 0 60px rgba(255, 170, 0, 0.2)',
            }}
          >
            VANGUARD
            <span className="text-orange-500"> BLINDSIDE</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-zinc-500 text-sm md:text-base mb-8 tracking-widest uppercase"
            style={{ textShadow: '0 0 10px rgba(255, 170, 0, 0.1)' }}
          >
            1v1 Tactical Zero-Knowledge Warfare
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <button
              className="group relative px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-orange-500 transition-all duration-300 rounded-sm overflow-hidden backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 170, 0, 0.15), inset 0 0 20px rgba(255, 170, 0, 0.05)',
              }}
            >
              <span className="relative z-10 text-zinc-100 font-bold tracking-wider uppercase text-sm group-hover:text-orange-500 transition-colors">
                Create Game
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-500/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            <button
              className="group relative px-8 py-4 bg-transparent border-2 border-zinc-700 hover:border-zinc-500 transition-all duration-300 rounded-sm backdrop-blur-sm"
              style={{ 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)',
              }}
            >
              <span className="text-zinc-400 font-bold tracking-wider uppercase text-sm group-hover:text-zinc-200 transition-colors">
                Join Game
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.7 : 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center gap-3 text-zinc-600 text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="tracking-widest">SERVERS ONLINE</span>
          </motion.div>

          {/* Tech specs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.4 : 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-6 text-zinc-700 text-xs font-mono"
          >
            <div className="flex items-center gap-4">
              <span>16-BIT PIXEL ART</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full" />
              <span>60 FPS</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full" />
              <span>P2P NETWORK</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel - Game Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="relative"
        >
          {/* Glow effect behind canvas */}
          <div 
            className="absolute -inset-4 rounded-xl opacity-50 blur-xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 170, 0, 0.15) 0%, transparent 70%)',
            }}
          />
          
          {/* Canvas container */}
          <div className="relative">
            <div 
              className="absolute -inset-1 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.2) 0%, transparent 50%, rgba(255, 170, 0, 0.1) 100%)',
              }}
            />
            <GameCanvas />
          </div>
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.5 : 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute -bottom-8 right-0 text-zinc-700 text-xs font-mono tracking-wider"
          >
            BATTLEFIELD PREVIEW v0.1.0
          </motion.div>
        </motion.div>

      </div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-4 left-4 text-zinc-600 text-xs font-mono"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-zinc-600 rotate-45" />
          <span>SYSTEM READY</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 left-4 text-zinc-600 text-xs font-mono"
      >
        <div className="flex items-center gap-2">
          <span className="text-orange-500/50">●</span>
          <span>LIVE ARENA</span>
        </div>
      </motion.div>
    </div>
  );
}
