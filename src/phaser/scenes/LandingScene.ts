import * as Phaser from 'phaser';

enum BattleState {
  IDLE = 'IDLE',
  TANK_FIRE = 'TANK_FIRE',
  ROVER_DODGE = 'ROVER_DODGE',
  ROVER_FIRE = 'ROVER_FIRE',
  TANK_REPOSITION = 'TANK_REPOSITION',
}

export default class LandingScene extends Phaser.Scene {
  // Game objects
  private tank!: Phaser.GameObjects.Graphics;
  private rover!: Phaser.GameObjects.Graphics;
  
  // State machine
  private battleState: BattleState = BattleState.IDLE;
  private stateTimer = 0;
  private readonly IDLE_DURATION = 2000;
  private readonly COOLDOWN_DURATION = 1500;
  
  // Positions
  private tankBaseX = 0;
  private tankBaseY = 0;
  private roverBaseX = 0;
  private roverBaseY = 0;
  
  // Effects
  private dustParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private fogGraphics!: Phaser.GameObjects.Graphics;
  private vignetteGraphics!: Phaser.GameObjects.Graphics;
  private cameraPanTween: Phaser.Tweens.Tween | null = null;
  
  // Sound
  private audioContext: AudioContext | null = null;

  constructor() {
    super({ key: 'LandingScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Initialize audio
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create background
    this.createBackground(width, height);

    // Set base positions
    this.tankBaseX = width * 0.2;
    this.tankBaseY = height * 0.6;
    this.roverBaseX = width * 0.75;
    this.roverBaseY = height * 0.55;

    // Create vehicles
    this.tank = this.createTank(this.tankBaseX, this.tankBaseY);
    this.rover = this.createRover(this.roverBaseX, this.roverBaseY);

    // Create atmospheric effects
    this.createDustParticles(width, height);
    this.createFog(width, height);
    this.createVignette(width, height);

    // Start camera pan
    this.startCameraPan();

    // Play launch ambient sound
    this.playLaunchSound();

    // Start battle loop
    this.stateTimer = 0;
    this.battleState = BattleState.IDLE;
  }

  private createBackground(width: number, height: number) {
    const graphics = this.add.graphics();

    // Dark battlefield gradient
    for (let y = 0; y < height; y += 4) {
      const alpha = 0.8 + (y / height) * 0.2;
      const green = 0x08 + Math.floor((y / height) * 0x04);
      graphics.fillStyle((green << 8) | 0x08, alpha);
      graphics.fillRect(0, y, width, 4);
    }

    // Dark green grid - subtle
    graphics.lineStyle(1, 0x152015, 0.15);
    const gridSize = 32;
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

    // Terrain craters
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(8, 20);
      graphics.fillStyle(0x0a140a, Phaser.Math.FloatBetween(0.3, 0.6));
      graphics.fillCircle(x, y, size);
    }

    // Ground debris
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      graphics.fillStyle(0x1a251a, Phaser.Math.FloatBetween(0.2, 0.4));
      graphics.fillRect(x, y, Phaser.Math.Between(2, 4), Phaser.Math.Between(2, 4));
    }
  }

  private createTank(x: number, y: number): Phaser.GameObjects.Graphics {
    const tank = this.add.graphics();
    tank.setDepth(10);
    this.drawTank(tank, x, y);
    return tank;
  }

  private drawTank(graphics: Phaser.GameObjects.Graphics, x: number, y: number) {
    graphics.clear();

    // Shadow
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillEllipse(x, y + 25, 70, 15);

    // Tracks
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRoundedRect(x - 35, y - 20, 70, 12, 3);
    graphics.fillRoundedRect(x - 35, y + 8, 70, 12, 3);

    // Track details
    graphics.fillStyle(0x2a2a2a, 1);
    for (let i = 0; i < 8; i++) {
      graphics.fillRect(x - 32 + i * 9, y - 19, 5, 10);
      graphics.fillRect(x - 32 + i * 9, y + 9, 5, 10);
    }

    // Body
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillRoundedRect(x - 30, y - 18, 60, 36, 4);

    // Upper hull
    graphics.fillStyle(0x4a5a4a, 1);
    graphics.fillRoundedRect(x - 25, y - 14, 50, 28, 3);

    // Armor plates
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillRect(x - 22, y - 12, 12, 10);
    graphics.fillRect(x + 10, y - 12, 12, 10);

    // Turret base
    graphics.fillStyle(0x4a5a4a, 1);
    graphics.fillCircle(x, y, 14);
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillCircle(x, y, 10);

    // Main cannon
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(x + 10, y - 3, 28, 6);
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(x + 38, y, 4);

    // Muzzle
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(x + 34, y - 2, 8, 4);

    // Headlight
    graphics.fillStyle(0xffcc44, 1);
    graphics.fillCircle(x + 30, y - 12, 2);

    // Exhaust ports
    graphics.fillStyle(0x333333, 1);
    graphics.fillCircle(x - 28, y - 8, 3);
    graphics.fillCircle(x - 28, y + 8, 3);

    // Detail lines
    graphics.lineStyle(1, 0x2a3a2a, 0.5);
    graphics.strokeRoundedRect(x - 30, y - 18, 60, 36, 4);
  }

  private createRover(x: number, y: number): Phaser.GameObjects.Graphics {
    const rover = this.add.graphics();
    rover.setDepth(10);
    this.drawRover(rover, x, y, 0);
    return rover;
  }

  private drawRover(graphics: Phaser.GameObjects.Graphics, x: number, y: number, rotation: number = 0) {
    graphics.clear();

    // Apply rotation offset
    const rotOffset = rotation * 2;

    // Shadow
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillEllipse(x + rotOffset, y + 18, 50, 10);

    // Wheels
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(x - 15, y + 12, 6);
    graphics.fillCircle(x + 15, y + 12, 6);
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillCircle(x - 15, y + 12, 4);
    graphics.fillCircle(x + 15, y + 12, 4);

    // Body
    graphics.fillStyle(0x4a3a2a, 1);
    graphics.fillRoundedRect(x - 22, y - 8 + rotOffset * 0.5, 44, 20, 4);

    // Armor plates
    graphics.fillStyle(0x5a4a3a, 1);
    graphics.fillRect(x - 18, y - 6 + rotOffset * 0.5, 10, 8);
    graphics.fillRect(x + 8, y - 6 + rotOffset * 0.5, 10, 8);

    // Cockpit
    graphics.fillStyle(0x3a2a1a, 1);
    graphics.fillRect(x - 8, y - 4 + rotOffset * 0.5, 16, 12);

    // Windshield
    graphics.fillStyle(0x2a4a5a, 0.7);
    graphics.fillRect(x - 6, y - 2 + rotOffset * 0.5, 12, 6);

    // Turret
    graphics.fillStyle(0x3a3a3a, 1);
    graphics.fillCircle(x, y - 8 + rotOffset * 0.5, 7);

    // Machine gun
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(x + 4, y - 10 + rotOffset * 0.5, 18, 4);

    // Muzzle
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(x + 20, y - 9 + rotOffset * 0.5, 5, 2);

    // Headlights
    graphics.fillStyle(0xffcc66, 1);
    graphics.fillCircle(x + 22, y + rotOffset * 0.5, 2);

    // Exhaust
    graphics.fillStyle(0x333333, 1);
    graphics.fillCircle(x - 20, y + rotOffset * 0.5, 2);
  }

  private createDustParticles(width: number, height: number) {
    // Create dust particle texture
    const dustKey = 'dust';
    if (!this.textures.exists(dustKey)) {
      const dustGraphics = this.make.graphics();
      dustGraphics.fillStyle(0x554433, 1);
      dustGraphics.fillCircle(2, 2, 2);
      dustGraphics.generateTexture(dustKey, 4, 4);
      dustGraphics.destroy();
    }

    this.dustParticles = this.add.particles(width / 2, height / 2, dustKey, {
      speed: { min: 10, max: 30 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.25, end: 0 },
      lifespan: 4000,
      frequency: 100,
      maxParticles: 40,
    });
    this.dustParticles.setDepth(3);
  }

  private createFog(width: number, height: number) {
    this.fogGraphics = this.add.graphics();
    this.fogGraphics.setDepth(4);

    // Animate fog slowly
    this.time.addEvent({
      delay: 50,
      callback: () => this.updateFog(width, height),
      loop: true,
    });
  }

  private updateFog(width: number, height: number) {
    this.fogGraphics.clear();
    const time = this.time.now / 1000;

    for (let i = 0; i < 5; i++) {
      const x = ((time * 10 + i * 200) % (width + 200)) - 100;
      const y = height * 0.3 + Math.sin(time * 0.5 + i) * 50;
      
      for (let j = 0; j < 3; j++) {
        const alpha = 0.03 - j * 0.01;
        const radius = 150 + j * 50;
        this.fogGraphics.fillStyle(0x2a3a2a, alpha);
        this.fogGraphics.fillCircle(x, y + j * 30, radius);
      }
    }
  }

  private createVignette(width: number, height: number) {
    this.vignetteGraphics = this.add.graphics();
    this.vignetteGraphics.setDepth(50);

    // Top vignette
    for (let i = 0; i < 30; i++) {
      const alpha = (30 - i) * 0.008;
      this.vignetteGraphics.fillStyle(0x000000, alpha);
      this.vignetteGraphics.fillRect(0, i * 4, width, 4);
    }

    // Bottom vignette
    for (let i = 0; i < 30; i++) {
      const alpha = (30 - i) * 0.012;
      this.vignetteGraphics.fillStyle(0x000000, alpha);
      this.vignetteGraphics.fillRect(0, height - (i + 1) * 4, width, 4);
    }

    // Left vignette
    for (let i = 0; i < 15; i++) {
      const alpha = (15 - i) * 0.005;
      this.vignetteGraphics.fillStyle(0x000000, alpha);
      this.vignetteGraphics.fillRect(i * 8, 0, 8, height);
    }

    // Right vignette
    for (let i = 0; i < 15; i++) {
      const alpha = (15 - i) * 0.005;
      this.vignetteGraphics.fillStyle(0x000000, alpha);
      this.vignetteGraphics.fillRect(width - (i + 1) * 8, 0, 8, height);
    }
  }

  private startCameraPan() {
    // Subtle horizontal pan loop
    const panAmount = 15;
    const duration = 8000;

    this.cameraPanTween = this.tweens.add({
      targets: this.cameras.main,
      scrollX: panAmount,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(_time: number, delta: number) {
    this.stateTimer += delta;

    switch (this.battleState) {
      case BattleState.IDLE:
        if (this.stateTimer >= this.IDLE_DURATION) {
          this.transitionToTankFire();
        }
        break;

      case BattleState.TANK_FIRE:
        // State transition handled in tankFire method
        break;

      case BattleState.ROVER_DODGE:
        // State transition handled in roverDodge method
        break;

      case BattleState.ROVER_FIRE:
        // State transition handled in roverFire method
        break;

      case BattleState.TANK_REPOSITION:
        // State transition handled in tankReposition method
        break;
    }
  }

  private transitionToTankFire() {
    this.battleState = BattleState.TANK_FIRE;
    this.stateTimer = 0;
    this.tankFire();
  }

  private tankFire() {
    // Play cannon sound
    this.playCannonSound();

    // Tank recoil
    this.tweens.add({
      targets: this.tank,
      x: this.tankBaseX - 8,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
      onUpdate: () => {
        this.drawTank(this.tank, this.tank.x, this.tankBaseY);
      },
      onComplete: () => {
        this.drawTank(this.tank, this.tankBaseX, this.tankBaseY);
      },
    });

    // Muzzle flash
    const muzzleX = this.tankBaseX + 45;
    const muzzleY = this.tankBaseY;
    this.createMuzzleFlash(muzzleX, muzzleY);

    // Smoke burst
    this.createSmokeBurst(muzzleX, muzzleY);

    // Projectile
    this.createProjectile(muzzleX, muzzleY, () => {
      // Transition to rover dodge
      this.transitionToRoverDodge();
    });
  }

  private createMuzzleFlash(x: number, y: number) {
    const flash = this.add.graphics();
    flash.setDepth(25);

    // Bright orange radial flash
    flash.fillStyle(0xff6600, 0.6);
    flash.fillCircle(x, y, 20);
    flash.fillStyle(0xffaa00, 0.8);
    flash.fillCircle(x, y, 14);
    flash.fillStyle(0xffff00, 1);
    flash.fillCircle(x, y, 8);
    flash.fillStyle(0xffffff, 1);
    flash.fillCircle(x, y, 4);

    // Camera shake
    this.cameras.main.shake(150, 0.01);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 100,
      onComplete: () => flash.destroy(),
    });
  }

  private createSmokeBurst(x: number, y: number) {
    const smokeKey = 'smoke';
    if (!this.textures.exists(smokeKey)) {
      const smokeGraphics = this.make.graphics();
      smokeGraphics.fillStyle(0x666666, 1);
      smokeGraphics.fillCircle(4, 4, 4);
      smokeGraphics.generateTexture(smokeKey, 8, 8);
      smokeGraphics.destroy();
    }

    const smokeEmitter = this.add.particles(x, y, smokeKey, {
      speed: { min: 60, max: 120 },
      angle: { min: -20, max: 20 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 500,
      frequency: -1,
      quantity: 12,
    });
    smokeEmitter.setDepth(20);
    smokeEmitter.explode();

    this.time.delayedCall(600, () => {
      smokeEmitter.destroy();
    });
  }

  private createProjectile(startX: number, startY: number, onComplete: () => void) {
    const projectile = this.add.graphics();
    projectile.setDepth(15);

    const targetX = this.roverBaseX - 30;
    const duration = 300;
    let elapsed = 0;

    const updateProjectile = (delta: number) => {
      elapsed += delta;
      const progress = Math.min(elapsed / duration, 1);

      projectile.clear();

      const currentX = startX + (targetX - startX) * progress;
      const currentY = startY;

      // Trail
      for (let i = 0; i < 8; i++) {
        const trailProgress = Math.max(0, progress - i * 0.03);
        const trailX = startX + (targetX - startX) * trailProgress;
        const alpha = (1 - i / 8) * 0.6;
        const size = 4 - i * 0.4;

        projectile.fillStyle(0xffaa00, alpha);
        projectile.fillCircle(trailX, currentY, Math.max(1, size));
      }

      // Core
      projectile.fillStyle(0xffff00, 1);
      projectile.fillCircle(currentX, currentY, 5);
      projectile.fillStyle(0xffffff, 1);
      projectile.fillCircle(currentX, currentY, 3);

      if (progress >= 1) {
        this.scene.scene.events.off('update', updateProjectile);
        projectile.destroy();

        // Explosion behind rover
        this.createExplosion(targetX + 20, this.roverBaseY);
        onComplete();
      }
    };

    this.scene.scene.events.on('update', updateProjectile);
  }

  private createExplosion(x: number, y: number) {
    this.playExplosionSound();

    const explosion = this.add.graphics();
    explosion.setDepth(30);

    let frame = 0;
    const maxFrames = 8;
    const frameDelay = 40;

    const animateExplosion = () => {
      if (frame >= maxFrames) {
        explosion.destroy();
        return;
      }

      explosion.clear();
      const progress = frame / maxFrames;
      const radius = 8 + progress * 25;
      const alpha = 1 - progress * 0.4;

      // Outer
      explosion.fillStyle(0xff4400, alpha * 0.5);
      explosion.fillCircle(x, y, radius + 8);
      // Main
      explosion.fillStyle(0xff6600, alpha * 0.8);
      explosion.fillCircle(x, y, radius);
      // Core
      explosion.fillStyle(0xffaa00, alpha);
      explosion.fillCircle(x, y, radius * 0.6);
      // Center
      explosion.fillStyle(0xffff00, alpha);
      explosion.fillCircle(x, y, radius * 0.3);

      // Debris
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = radius + frame * 3;
        const px = x + Math.cos(angle) * dist;
        const py = y + Math.sin(angle) * dist;
        explosion.fillStyle(0xff6600, alpha * 0.7);
        explosion.fillCircle(px, py, 3);
      }

      frame++;
      this.time.delayedCall(frameDelay, animateExplosion);
    };

    animateExplosion();

    // Camera shake
    this.cameras.main.shake(200, 0.015);

    // Screen flash
    const flash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0xffffff,
      0.15
    );
    flash.setDepth(40);
    flash.setScrollFactor(0);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => flash.destroy(),
    });
  }

  private transitionToRoverDodge() {
    this.battleState = BattleState.ROVER_DODGE;
    this.stateTimer = 0;
    this.roverDodge();
  }

  private roverDodge() {
    const dodgeX = 40;
    const dodgeY = 25;
    const duration = 200;

    // Drift diagonally
    this.tweens.add({
      targets: this.rover,
      x: this.roverBaseX + dodgeX,
      y: this.roverBaseY - dodgeY,
      duration: duration,
      ease: 'Power2',
      onUpdate: () => {
        const progress = (this.rover.x - this.roverBaseX) / dodgeX;
        const rotation = Math.sin(progress * Math.PI) * 0.15;
        this.drawRover(this.rover, this.rover.x, this.rover.y, rotation);
      },
      onComplete: () => {
        // Dust particles during drift
        this.createDustBurst(this.roverBaseX + dodgeX, this.roverBaseY);

        // Return to original position after delay
        this.time.delayedCall(400, () => {
          this.tweens.add({
            targets: this.rover,
            x: this.roverBaseX,
            y: this.roverBaseY,
            duration: 300,
            ease: 'Power2',
            onUpdate: () => {
              const progress = 1 - (this.rover.x - this.roverBaseX) / dodgeX;
              const rotation = Math.sin(progress * Math.PI) * 0.1;
              this.drawRover(this.rover, this.rover.x, this.rover.y, rotation);
            },
            onComplete: () => {
              this.drawRover(this.rover, this.roverBaseX, this.roverBaseY, 0);
              
              // Cooldown then fire
              this.time.delayedCall(this.COOLDOWN_DURATION, () => {
                this.transitionToRoverFire();
              });
            },
          });
        });
      },
    });
  }

  private createDustBurst(x: number, y: number) {
    const dustKey = 'dust';
    const dustBurst = this.add.particles(x, y, dustKey, {
      speed: { min: 30, max: 60 },
      angle: { min: 180, max: 270 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 400,
      frequency: -1,
      quantity: 10,
    });
    dustBurst.setDepth(8);
    dustBurst.explode();

    this.time.delayedCall(500, () => {
      dustBurst.destroy();
    });
  }

  private transitionToRoverFire() {
    this.battleState = BattleState.ROVER_FIRE;
    this.stateTimer = 0;
    this.roverFire();
  }

  private roverFire() {
    this.playMachineGunSound();

    const startX = this.roverBaseX + 25;
    const startY = this.roverBaseY - 10;
    const targetX = this.tankBaseX + 40;

    // Fire 3 rapid projectiles
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 100, () => {
        this.createRoverProjectile(startX, startY + (i - 1) * 5, targetX, this.tankBaseY + (i - 1) * 5);
      });
    }

    // Small flash at rover gun
    const flash = this.add.graphics();
    flash.fillStyle(0xffaa00, 1);
    flash.fillCircle(startX, startY, 6);
    flash.fillStyle(0xffff00, 1);
    flash.fillCircle(startX, startY, 3);
    flash.setDepth(25);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 80,
      onComplete: () => {
        flash.destroy();
        
        // Cooldown then tank reposition
        this.time.delayedCall(this.COOLDOWN_DURATION, () => {
          this.transitionToTankReposition();
        });
      },
    });
  }

  private createRoverProjectile(startX: number, startY: number, targetX: number, targetY: number) {
    const projectile = this.add.graphics();
    projectile.setDepth(15);

    const duration = 180;
    let elapsed = 0;

    const updateProjectile = (delta: number) => {
      elapsed += delta;
      const progress = Math.min(elapsed / duration, 1);

      projectile.clear();

      const currentX = startX + (targetX - startX) * progress;
      const currentY = startY + (targetY - startY) * progress;

      // Small trail
      projectile.fillStyle(0xffaa00, 0.6);
      projectile.fillCircle(currentX - 8, currentY, 2);

      // Core
      projectile.fillStyle(0xffff00, 1);
      projectile.fillCircle(currentX, currentY, 3);

      if (progress >= 1) {
        this.scene.scene.events.off('update', updateProjectile);
        projectile.destroy();

        // Spark effect on tank
        this.createSparks(targetX, targetY);

        // Tank shake
        this.tweens.add({
          targets: this.tank,
          x: this.tankBaseX + 3,
          duration: 30,
          yoyo: true,
          repeat: 2,
          onUpdate: () => {
            this.drawTank(this.tank, this.tank.x, this.tankBaseY);
          },
          onComplete: () => {
            this.drawTank(this.tank, this.tankBaseX, this.tankBaseY);
          },
        });
      }
    };

    this.scene.scene.events.on('update', updateProjectile);
  }

  private createSparks(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.graphics();
      spark.fillStyle(0xffaa00, 1);
      spark.fillCircle(0, 0, 2);
      spark.setPosition(x, y);
      spark.setDepth(25);

      const angle = Phaser.Math.FloatBetween(-Math.PI, 0);
      const distance = Phaser.Math.Between(15, 30);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 150,
        onComplete: () => spark.destroy(),
      });
    }
  }

  private transitionToTankReposition() {
    this.battleState = BattleState.TANK_REPOSITION;
    this.stateTimer = 0;
    this.tankReposition();
  }

  private tankReposition() {
    // Slight reposition
    const offsetX = Phaser.Math.Between(-10, 10);
    const offsetY = Phaser.Math.Between(-5, 5);

    this.tweens.add({
      targets: this.tank,
      x: this.tankBaseX + offsetX,
      y: this.tankBaseY + offsetY,
      duration: 200,
      ease: 'Power2',
      onUpdate: () => {
        this.drawTank(this.tank, this.tank.x, this.tank.y);
      },
      onComplete: () => {
        // Return to base position
        this.time.delayedCall(100, () => {
          this.tweens.add({
            targets: this.tank,
            x: this.tankBaseX,
            y: this.tankBaseY,
            duration: 150,
            ease: 'Power2',
            onUpdate: () => {
              this.drawTank(this.tank, this.tank.x, this.tank.y);
            },
            onComplete: () => {
              this.drawTank(this.tank, this.tankBaseX, this.tankBaseY);

              // Cooldown then back to IDLE
              this.time.delayedCall(this.COOLDOWN_DURATION, () => {
                this.battleState = BattleState.IDLE;
                this.stateTimer = 0;
              });
            },
          });
        });
      },
    });
  }

  // Sound methods
  private playCannonSound() {
    if (!this.audioContext) return;

    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, this.audioContext.currentTime);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(60, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioContext.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.3);
    osc2.stop(this.audioContext.currentTime + 0.3);
  }

  private playExplosionSound() {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, this.audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);

    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  private playMachineGunSound() {
    if (!this.audioContext) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(200 + Math.random() * 100, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
      }, i * 100);
    }
  }

  private playLaunchSound() {
    if (!this.audioContext) return;

    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, this.audioContext.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, this.audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 3);
    osc2.stop(this.audioContext.currentTime + 3);
  }

  shutdown() {
    if (this.cameraPanTween) {
      this.cameraPanTween.stop();
    }
    if (this.dustParticles) {
      this.dustParticles.destroy();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
