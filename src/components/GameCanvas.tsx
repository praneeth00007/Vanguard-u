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
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      backgroundColor: '#080c08',
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
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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

    // Handle resize
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
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
        className="fixed inset-0 z-0 bg-[#080c08]"
      />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0"
      style={{ 
        backgroundColor: '#080c08',
        pointerEvents: 'none'
      }}
    />
  );
}
