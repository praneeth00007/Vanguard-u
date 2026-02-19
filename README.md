# Vanguard Blindside

1v1 Tactical Zero-Knowledge Warfare - A 16-bit pixel art tank combat game.

## Overview

Vanguard Blindside is a tactical warfare game featuring intense tank vs rover battles rendered in retro 16-bit pixel art style. Built with Next.js 14 and Phaser 3.

## Features

- **16-bit Pixel Art**: Detailed sprite sheets with authentic retro aesthetics
- **Tank Combat**: Heavy armored tank with cannon fire and recoil animations
- **Rover Tactics**: Fast tactical rover with drift movement and machine gun
- **Battlefield Effects**: Muzzle flashes, projectile trails, explosions, and smoke particles
- **Sound Design**: Synthesized retro sound effects using Web Audio API
- **Responsive Design**: Dark tactical theme with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Game Engine**: Phaser 3
- **Styling**: Tailwind CSS, Framer Motion
- **Audio**: Web Audio API for synthesized sounds
- **Package Manager**: Bun

## Installation

```bash
bun install
```

## Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── GameCanvas.tsx
├── phaser/
│   └── scenes/
│       └── LandingScene.ts
└── utils/
    ├── SoundGenerator.ts
    └── SpriteGenerator.ts
```

## Sprite Animations

The game features multiple animation sequences:

- **Tank Idle**: Engine vibration (4 frames)
- **Tank Fire**: Cannon recoil with muzzle flash (4 frames)
- **Rover Drift**: Tactical movement (6 frames)
- **Rover Fire**: Machine gun burst (4 frames)
- **Explosion**: Detonation sequence (8 frames)
- **Muzzle Flash**: Weapon discharge (4 frames)
- **Smoke Loop**: Exhaust particles (6 frames)

## Color Palette

Military-themed with muted tones:
- Dark battlefield: `#0a0f0a`
- Tank armor: `#3a4a3a` - `#4a5a4a`
- Rover body: `#4a3a2a` - `#5a4a3a`
- Muzzle flash: `#ff6600` - `#ffff00`
- Explosion core: `#ffaa00`

## Controls

The landing page displays a cinematic loop demonstrating:
- Tank firing cannon every 3 seconds
- Rover dodging and returning fire
- Explosion animations with camera shake

## License

MIT
