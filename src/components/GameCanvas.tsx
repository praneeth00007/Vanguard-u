'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Phaser from 'phaser';
import LandingScene from '@/phaser/scenes/LandingScene';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initGame = useCallback(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      parent: containerRef.current,
      backgroundColor: '#0a0f0a',
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 400,
      },
      render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true,
      },
      audio: {
        disableWebAudio: false,
      },
      scene: [LandingScene],
    };

    gameRef.current = new Phaser.Game(config);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initGame();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isMounted, initGame]);

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div 
        className="w-full aspect-[3/2] min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-950 flex items-center justify-center"
      >
        <div className="text-zinc-700 text-sm animate-pulse">Loading Battlefield...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full aspect-[3/2] min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border-2 border-zinc-800 shadow-2xl"
      style={{ backgroundColor: '#0a0f0a' }}
    />
  );
}
