import * as Phaser from 'phaser';
import { SpriteGenerator } from '@/utils/SpriteGenerator';
import { soundGenerator } from '@/utils/SoundGenerator';

export default class LandingScene extends Phaser.Scene {
  private tank!: Phaser.GameObjects.Sprite;
  private rover!: Phaser.GameObjects.Sprite;
  private muzzleFlash!: Phaser.GameObjects.Sprite;
  private explosions: Phaser.GameObjects.Sprite[] = [];
  private smokeEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private actionTimer = 0;
  private isFiring = false;
  private projectile!: Phaser.GameObjects.Graphics;
  private projectileActive = false;
  private projectileX = 0;
  private projectileY = 0;
  private roverStartX = 0;
  private roverStartY = 0;
  private spriteGenerator!: SpriteGenerator;
  private launchSoundPlayed = false;

  constructor() {
    super({ key: 'LandingScene' });
  }

  preload() {
    // Sprites will be generated in create
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Generate all sprites
    this.spriteGenerator = new SpriteGenerator(this);
    this.spriteGenerator.generateAll();

    // Create animations
    this.spriteGenerator.createTankAnimations(this);
    this.spriteGenerator.createRoverAnimations(this);
    this.spriteGenerator.createExplosionAnimations(this);
    this.spriteGenerator.createMuzzleFlashAnimations(this);
    this.spriteGenerator.createSmokeAnimations(this);

    // Create background
    this.createBackground(width, height);

    // Create game objects
    this.createTank(width * 0.25, height * 0.6);
    this.createRover(width * 0.65, height * 0.55);
    this.createMuzzleFlash();
    this.createProjectile();
    this.createParticleSystems(width, height);

    // Store rover starting position
    this.roverStartX = this.rover.x;
    this.roverStartY = this.rover.y;

    // Start idle animations
    this.tank.play('tank_idle');
    this.rover.play('rover_drift');

    // Play launch sound once
    if (!this.launchSoundPlayed) {
      this.time.delayedCall(500, () => {
        soundGenerator.launchSound();
        this.launchSoundPlayed = true;
      });
    }

    // Periodic engine sounds
    this.time.addEvent({
      delay: 300,
      callback: () => {
        if (!this.isFiring) {
          soundGenerator.engineIdle();
        }
      },
      loop: true,
    });
  }

  private createBackground(width: number, height: number) {
    const graphics = this.add.graphics();

    // Dark battlefield background
    graphics.fillStyle(0x0a0f0a, 1);
    graphics.fillRect(0, 0, width, height);

    // Subtle grid texture
    graphics.lineStyle(1, 0x1a2a1a, 0.2);
    const gridSize = 24;
    for (let x = 0; x <= width; x += gridSize) {
      graphics.beginPath();
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
      graphics.strokePath();
    }
    for (let y = 0; y <= height; y += gridSize) {
      graphics.beginPath();
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
      graphics.strokePath();
    }

    // Terrain details - craters and debris
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(4, 12);
      graphics.fillStyle(0x1a2a1a, Phaser.Math.FloatBetween(0.2, 0.5));
      graphics.fillCircle(x, y, size);
    }

    // Vignette effect
    const vignette = this.add.graphics();
    for (let i = 0; i < 20; i++) {
      const alpha = i * 0.02;
      vignette.fillStyle(0x000000, alpha);
      vignette.fillRect(0, 0, width, i * 4);
      vignette.fillRect(0, height - i * 4, width, i * 4);
    }
  }

  private createTank(x: number, y: number) {
    this.tank = this.add.sprite(x, y, 'tank_sheet', 0);
    this.tank.setScale(1.5);
    this.tank.setDepth(10);
  }

  private createRover(x: number, y: number) {
    this.rover = this.add.sprite(x, y, 'rover_sheet', 0);
    this.rover.setScale(1.5);
    this.rover.setDepth(10);
  }

  private createMuzzleFlash() {
    this.muzzleFlash = this.add.sprite(0, 0, 'muzzle_flash_sheet', 0);
    this.muzzleFlash.setVisible(false);
    this.muzzleFlash.setScale(2);
    this.muzzleFlash.setDepth(25);

    this.muzzleFlash.on('animationcomplete', () => {
      this.muzzleFlash.setVisible(false);
    });
  }

  private createProjectile() {
    this.projectile = this.add.graphics();
    this.projectile.setVisible(false);
    this.projectile.setDepth(15);
  }

  private createParticleSystems(width: number, height: number) {
    // Smoke particles for exhaust
    const smokeKey = 'smoke_particle';
    if (!this.textures.exists(smokeKey)) {
      const smokeGraphics = this.make.graphics();
      smokeGraphics.fillStyle(0x888888, 1);
      smokeGraphics.fillCircle(4, 4, 4);
      smokeGraphics.generateTexture(smokeKey, 8, 8);
      smokeGraphics.destroy();
    }

    // Tank exhaust emitter
    const tankSmoke = this.add.particles(0, 0, smokeKey, {
      speed: { min: 20, max: 40 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.6, end: 0.1 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 600,
      frequency: 150,
      maxParticles: 10,
    });
    tankSmoke.setDepth(5);
    this.smokeEmitters.push(tankSmoke);

    // Rover exhaust emitter
    const roverSmoke = this.add.particles(0, 0, smokeKey, {
      speed: { min: 30, max: 50 },
      angle: { min: 150, max: 210 },
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 0.4, end: 0 },
      lifespan: 400,
      frequency: 200,
      maxParticles: 8,
    });
    roverSmoke.setDepth(5);
    this.smokeEmitters.push(roverSmoke);

    // Dust particles for atmosphere
    const dustKey = 'dust_particle';
    if (!this.textures.exists(dustKey)) {
      const dustGraphics = this.make.graphics();
      dustGraphics.fillStyle(0x554433, 1);
      dustGraphics.fillCircle(2, 2, 2);
      dustGraphics.generateTexture(dustKey, 4, 4);
      dustGraphics.destroy();
    }

    this.dustEmitter = this.add.particles(width / 2, height / 2, dustKey, {
      speed: { min: 5, max: 20 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 3000,
      frequency: 80,
      maxParticles: 30,
    });
    this.dustEmitter.setDepth(2);
  }

  update(_time: number, delta: number) {
    this.actionTimer += delta;

    // Update smoke emitter positions
    if (this.tank) {
      this.smokeEmitters[0]?.setPosition(this.tank.x - 30, this.tank.y + 10);
    }
    if (this.rover) {
      this.smokeEmitters[1]?.setPosition(this.rover.x - 25, this.rover.y + 5);
    }

    // Trigger action sequence every 3 seconds
    if (!this.isFiring && this.actionTimer >= 3000) {
      this.actionTimer = 0;
      this.fireSequence();
    }

    // Update projectile
    if (this.projectileActive) {
      this.updateProjectile(delta);
    }
  }

  private updateProjectile(delta: number) {
    this.projectileX += delta * 0.6;
    this.projectile.clear();

    // Draw projectile with trail
    const trailLength = 15;
    for (let i = 0; i < trailLength; i++) {
      const alpha = 1 - (i / trailLength);
      const offsetX = -i * 3;
      const size = 4 - (i * 0.2);
      
      this.projectile.fillStyle(0xffaa00, alpha * 0.7);
      this.projectile.fillCircle(this.projectileX + offsetX, this.projectileY, Math.max(1, size));
    }
    
    // Bright core
    this.projectile.fillStyle(0xffff00, 1);
    this.projectile.fillCircle(this.projectileX, this.projectileY, 5);

    // Check if projectile reached target
    if (this.projectileX > this.cameras.main.width * 0.5) {
      this.projectileActive = false;
      this.projectile.setVisible(false);
      this.triggerExplosion();
    }
  }

  private fireSequence() {
    this.isFiring = true;

    // Play cannon fire sound
    soundGenerator.cannonFire();

    // Show muzzle flash
    const muzzleX = this.tank.x + 50;
    const muzzleY = this.tank.y;
    this.muzzleFlash.setPosition(muzzleX, muzzleY);
    this.muzzleFlash.setVisible(true);
    this.muzzleFlash.play('muzzle_flash_anim');

    // Emit smoke from muzzle
    this.createBurstSmoke(muzzleX, muzzleY);

    // Start projectile
    this.projectileX = muzzleX;
    this.projectileY = muzzleY;
    this.projectile.setVisible(true);
    this.projectileActive = true;

    // Tank recoil animation
    this.tweens.add({
      targets: this.tank,
      x: this.tank.x - 8,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
    });

    // Rover dodges after delay
    this.time.delayedCall(200, () => {
      this.roverDodge();
    });

    // Rover fires back
    this.time.delayedCall(600, () => {
      this.roverFireBack();
    });

    // Reset firing state
    this.time.delayedCall(1200, () => {
      this.isFiring = false;
    });
  }

  private createBurstSmoke(x: number, y: number) {
    const smokeKey = 'smoke_particle';
    const burstEmitter = this.add.particles(x, y, smokeKey, {
      speed: { min: 50, max: 100 },
      angle: { min: -30, max: 30 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 400,
      frequency: -1,
      quantity: 8,
    });
    burstEmitter.setDepth(20);
    burstEmitter.explode();

    this.time.delayedCall(500, () => {
      burstEmitter.destroy();
    });
  }

  private roverDodge() {
    const targetX = this.roverStartX + Phaser.Math.Between(-40, 40);
    const targetY = this.roverStartY + Phaser.Math.Between(-30, 30);

    this.tweens.add({
      targets: this.rover,
      x: targetX,
      y: targetY,
      duration: 180,
      ease: 'Power2',
      onComplete: () => {
        // Return to start after dodge
        this.time.delayedCall(400, () => {
          this.tweens.add({
            targets: this.rover,
            x: this.roverStartX,
            y: this.roverStartY,
            duration: 250,
            ease: 'Power2',
          });
        });
      },
    });
  }

  private roverFireBack() {
    // Play machine gun sound
    soundGenerator.machineGun();

    // Flash effect at rover gun position
    const flashX = this.rover.x + 30;
    const flashY = this.rover.y;

    const flash = this.add.circle(flashX, flashY, 6, 0xffaa00, 1);
    flash.setDepth(25);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 100,
      onComplete: () => flash.destroy(),
    });

    // Tracer rounds
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 80, () => {
        this.createTracerRound(flashX, flashY);
      });
    }
  }

  private createTracerRound(x: number, y: number) {
    const tracer = this.add.graphics();
    tracer.fillStyle(0xffff00, 1);
    tracer.fillCircle(3, 3, 3);
    tracer.setPosition(x, y);
    tracer.setDepth(15);

    this.tweens.add({
      targets: tracer,
      x: x - 200,
      alpha: 0,
      duration: 200,
      ease: 'Linear',
      onComplete: () => tracer.destroy(),
    });
  }

  private triggerExplosion() {
    soundGenerator.explosion();

    const explosionX = this.cameras.main.width * 0.5;
    const explosionY = this.cameras.main.height * 0.5;

    // Create explosion sprite
    const explosion = this.add.sprite(explosionX, explosionY, 'explosion_sheet', 0);
    explosion.setScale(2.5);
    explosion.setDepth(30);
    this.explosions.push(explosion);

    explosion.on('animationcomplete', () => {
      explosion.destroy();
      const idx = this.explosions.indexOf(explosion);
      if (idx > -1) this.explosions.splice(idx, 1);
    });

    explosion.play('explosion_anim');

    // Camera shake
    this.cameras.main.shake(250, 0.015);

    // Screen flash
    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0xffffff,
      0.3
    );
    flash.setDepth(35);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => flash.destroy(),
    });

    // Explosion smoke
    this.createExplosionSmoke(explosionX, explosionY);
  }

  private createExplosionSmoke(x: number, y: number) {
    const smokeKey = 'smoke_particle';
    const explosionSmoke = this.add.particles(x, y, smokeKey, {
      speed: { min: 60, max: 120 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0.2 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 800,
      frequency: -1,
      quantity: 20,
    });
    explosionSmoke.setDepth(28);
    explosionSmoke.explode();

    this.time.delayedCall(1000, () => {
      explosionSmoke.destroy();
    });
  }
}
