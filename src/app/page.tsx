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
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Phaser Canvas - Full viewport background */}
      <GameCanvas />
      
      {/* UI Overlay - Above canvas */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-8 md:px-16 lg:px-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100 tracking-tight mb-2"
          style={{ 
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 40px rgba(255, 170, 0, 0.5), 0 0 80px rgba(255, 170, 0, 0.3)',
          }}
        >
          VANGUARD
          <span className="text-orange-500"> BLINDSIDE</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-zinc-500 text-xs md:text-sm mb-8 md:mb-10 tracking-widest uppercase"
          style={{ textShadow: '0 0 10px rgba(255, 170, 0, 0.2)' }}
        >
          1v1 Tactical Zero-Knowledge Warfare
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-col gap-3 md:gap-4 w-full max-w-xs"
        >
          <button
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-700 hover:border-orange-500 transition-all duration-300 rounded-sm overflow-hidden backdrop-blur-md"
            style={{ 
              boxShadow: '0 0 30px rgba(255, 170, 0, 0.1), inset 0 0 30px rgba(255, 170, 0, 0.03)',
            }}
          >
            <span className="relative z-10 text-zinc-100 font-bold tracking-wider uppercase text-xs md:text-sm group-hover:text-orange-500 transition-colors">
              Create Game
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>

          <button
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-transparent border border-zinc-800 hover:border-zinc-600 transition-all duration-300 rounded-sm backdrop-blur-md"
            style={{ 
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.03)',
            }}
          >
            <span className="text-zinc-500 font-bold tracking-wider uppercase text-xs md:text-sm group-hover:text-zinc-300 transition-colors">
              Join Game
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.7 : 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-8 md:mt-12 flex items-center gap-3 text-zinc-600 text-xs"
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
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-4 text-zinc-700 text-xs font-mono hidden md:block"
        >
          <div className="flex items-center gap-4">
            <span>16-BIT PIXEL ART</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>60 FPS</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>P2P NETWORK</span>
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.15 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-4 left-4 text-zinc-600 text-xs font-mono z-20"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-zinc-600 rotate-45" />
          <span>SYSTEM READY</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.15 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 left-4 text-zinc-600 text-xs font-mono z-20"
      >
        <div className="flex items-center gap-2">
          <span className="text-orange-500/50">●</span>
          <span>LIVE ARENA</span>
        </div>
      </motion.div>

      {/* Version tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.3 : 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-4 right-4 text-zinc-700 text-xs font-mono z-20"
      >
        v0.1.0
      </motion.div>
    </div>
  );
}
