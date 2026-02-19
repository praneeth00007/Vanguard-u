'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import LandingScene from '@/phaser/scenes/LandingScene';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      parent: containerRef.current,
      backgroundColor: '#0a0a0a',
      pixelArt: true,
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
      },
      scene: [LandingScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div 
        className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border-2 border-zinc-700 shadow-2xl bg-zinc-900"
      />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border-2 border-zinc-700 shadow-2xl"
      style={{ backgroundColor: '#0a0a0a' }}
    />
  );
}
