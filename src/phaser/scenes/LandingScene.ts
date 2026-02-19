// This file runs on the client only
import * as Phaser from 'phaser';

export default class LandingScene extends Phaser.Scene {
  private tank!: Phaser.GameObjects.Container;
  private rover!: Phaser.GameObjects.Container;
  private muzzleFlash!: Phaser.GameObjects.Sprite;
  private projectile!: Phaser.GameObjects.Graphics;
  private explosion!: Phaser.GameObjects.Sprite;
  private smokeParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private actionTimer = 0;
  private isFiring = false;
  private projectileActive = false;
  private projectileX = 0;
  private projectileY = 0;
  private roverStartX = 0;
  private roverStartY = 0;
  private tankRecoil = 0;

  constructor() {
    super({ key: 'LandingScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.createBackground(width, height);
    this.createTank(width * 0.25, height * 0.6);
    this.createRover(width * 0.65, height * 0.55);
    this.createMuzzleFlash(width * 0.28, height * 0.58);
    this.createProjectile();
    this.createExplosion(width * 0.5, height * 0.5);
    this.createSmokeParticles();
    this.createDustParticles();
    this.createAnimations();
    
    this.roverStartX = this.rover.x;
    this.roverStartY = this.rover.y;
  }

  private createBackground(width: number, height: number) {
    const graphics = this.add.graphics();
    
    graphics.fillStyle(0x0a0f0a, 1);
    graphics.fillRect(0, 0, width, height);
    
    graphics.lineStyle(1, 0x1a2a1a, 0.3);
    const gridSize = 20;
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

    const terrain = this.add.graphics();
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(2, 8);
      terrain.fillStyle(0x1a2a1a, Phaser.Math.FloatBetween(0.3, 0.6));
      terrain.fillCircle(x, y, size);
    }
  }

  private createTank(x: number, y: number) {
    this.tank = this.add.container(x, y);
    
    const tankBody = this.add.graphics();
    
    tankBody.fillStyle(0x3a4a3a, 1);
    tankBody.fillRoundedRect(-30, -18, 60, 36, 4);
    
    tankBody.fillStyle(0x2a3a2a, 1);
    tankBody.fillRect(-25, -14, 50, 28);
    
    tankBody.fillStyle(0x4a5a4a, 1);
    tankBody.fillRect(-20, -8, 40, 20);
    
    tankBody.fillStyle(0x2a3a2a, 1);
    tankBody.fillRoundedRect(-10, -24, 20, 10, 2);
    
    tankBody.fillStyle(0x1a1a1a, 1);
    tankBody.fillCircle(-18, 12, 8);
    tankBody.fillCircle(18, 12, 8);
    tankBody.fillStyle(0x2a2a2a, 1);
    tankBody.fillCircle(-18, 12, 5);
    tankBody.fillCircle(18, 12, 5);
    
    tankBody.fillStyle(0x3a3a3a, 1);
    tankBody.fillCircle(-18, 12, 2);
    tankBody.fillCircle(18, 12, 2);

    const turret = this.add.graphics();
    turret.fillStyle(0x4a5a4a, 1);
    turret.fillCircle(0, -8, 14);
    turret.fillStyle(0x3a4a3a, 1);
    turret.fillCircle(0, -8, 10);
    
    turret.fillStyle(0x2a2a2a, 1);
    turret.fillRoundedRect(10, -4, 24, 6, 1);
    turret.fillStyle(0x1a1a1a, 1);
    turret.fillCircle(34, -1, 3);

    const headlight = this.add.graphics();
    headlight.fillStyle(0xffaa44, 0.8);
    headlight.fillCircle(30, -1, 2);
    
    const exhaust = this.add.graphics();
    exhaust.fillStyle(0x333333, 1);
    exhaust.fillEllipse(-25, 16, 8, 4);
    
    const detail = this.add.graphics();
    detail.lineStyle(1, 0x2a3a2a, 1);
    detail.strokeRoundedRect(-30, -18, 60, 36, 4);

    this.tank.add([tankBody, turret, headlight, exhaust, detail]);
    this.tank.setDepth(10);
  }

  private createRover(x: number, y: number) {
    this.rover = this.add.container(x, y);
    
    const roverBody = this.add.graphics();
    
    roverBody.fillStyle(0x4a3a2a, 1);
    roverBody.fillRoundedRect(-22, -10, 44, 20, 3);
    
    roverBody.fillStyle(0x3a2a1a, 1);
    roverBody.fillRect(-18, -6, 36, 16);
    
    roverBody.fillStyle(0x5a4a3a, 1);
    roverBody.fillRect(-14, -4, 28, 12);
    
    roverBody.fillStyle(0x2a2a2a, 1);
    roverBody.fillCircle(-14, 8, 6);
    roverBody.fillCircle(14, 8, 6);
    roverBody.fillStyle(0x3a3a3a, 1);
    roverBody.fillCircle(-14, 8, 4);
    roverBody.fillCircle(14, 8, 4);
    
    roverBody.fillStyle(0x1a1a1a, 1);
    roverBody.fillRoundedRect(-8, -14, 16, 6, 2);
    
    const gun = this.add.graphics();
    gun.fillStyle(0x2a2a2a, 1);
    gun.fillRoundedRect(8, -3, 16, 4, 1);
    gun.fillStyle(0x1a1a1a, 1);
    gun.fillCircle(24, -1, 2);
    
    const headlight = this.add.graphics();
    headlight.fillStyle(0xffcc66, 0.9);
    headlight.fillCircle(20, 0, 2);
    headlight.fillStyle(0xffaa44, 0.5);
    headlight.fillCircle(20, 0, 4);
    
    const exhaust = this.add.graphics();
    exhaust.fillStyle(0x222222, 1);
    exhaust.fillCircle(-20, 4, 3);
    
    const armor = this.add.graphics();
    armor.fillStyle(0x5a4a3a, 0.8);
    armor.fillRect(-10, -8, 8, 6);
    armor.fillRect(2, -8, 8, 6);

    this.rover.add([roverBody, gun, headlight, exhaust, armor]);
    this.rover.setDepth(10);
  }

  private createMuzzleFlash(x: number, y: number) {
    this.muzzleFlash = this.add.sprite(x, y, '__DEFAULT');
    this.muzzleFlash.setVisible(false);
    this.muzzleFlash.setDepth(20);
  }

  private createProjectile() {
    this.projectile = this.add.graphics();
    this.projectile.setVisible(false);
    this.projectile.setDepth(15);
  }

  private createExplosion(x: number, y: number) {
    this.explosion = this.add.sprite(x, y, '__DEFAULT');
    this.explosion.setVisible(false);
    this.explosion.setDepth(25);
  }

  private createSmokeParticles() {
    const smokeGraphics = this.make.graphics();
    smokeGraphics.fillStyle(0x888888, 1);
    smokeGraphics.fillCircle(4, 4, 4);
    smokeGraphics.generateTexture('smoke', 8, 8);
    smokeGraphics.destroy();

    this.smokeParticles = this.add.particles(0, 0, 'smoke', {
      speed: { min: 10, max: 30 },
      angle: { min: 180, max: 270 },
      scale: { start: 0.5, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 800,
      frequency: -1,
      emitting: false,
    });
    this.smokeParticles.setDepth(5);
  }

  private createDustParticles() {
    const dustGraphics = this.make.graphics();
    dustGraphics.fillStyle(0x665544, 1);
    dustGraphics.fillCircle(2, 2, 2);
    dustGraphics.generateTexture('dust', 4, 4);
    dustGraphics.destroy();

    this.dustParticles = this.add.particles(0, 0, 'dust', {
      speed: { min: 5, max: 15 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.4, end: 0 },
      lifespan: 2000,
      frequency: 100,
      maxParticles: 20,
    });
    this.dustParticles.setDepth(3);
  }

  private createAnimations() {
    this.anims.create({
      key: 'tank_idle',
      frames: this.generateVibrationFrames(),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'rover_drift',
      frames: this.generateDriftFrames(),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: 'muzzle_flash',
      frames: this.generateMuzzleFlashFrames(),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: 'explosion',
      frames: this.generateExplosionFrames(),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'smoke_loop',
      frames: this.generateSmokeFrames(),
      frameRate: 10,
      repeat: -1,
    });

    this.startIdleAnimation();
  }

  private startIdleAnimation() {
    this.tweens.add({
      targets: this.tank,
      y: this.tank.y + 1,
      duration: 50,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.rover,
      y: this.rover.y + 1,
      duration: 40,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private generateVibrationFrames() {
    const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 4; i++) {
      frames.push({
        frame: i,
        key: '__DEFAULT',
      });
    }
    return frames;
  }

  private generateDriftFrames() {
    const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 6; i++) {
      frames.push({
        frame: i,
        key: '__DEFAULT',
      });
    }
    return frames;
  }

  private generateMuzzleFlashFrames() {
    const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 4; i++) {
      frames.push({
        frame: i,
        key: '__DEFAULT',
      });
    }
    return frames;
  }

  private generateExplosionFrames() {
    const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 8; i++) {
      frames.push({
        frame: i,
        key: '__DEFAULT',
      });
    }
    return frames;
  }

  private generateSmokeFrames() {
    const frames: Phaser.Types.Animations.AnimationFrame[] = [];
    for (let i = 0; i < 6; i++) {
      frames.push({
        frame: i,
        key: '__DEFAULT',
      });
    }
    return frames;
  }

  update(_time: number, delta: number) {
    this.actionTimer += delta;

    if (!this.isFiring && this.actionTimer >= 3000) {
      this.actionTimer = 0;
      this.fireSequence();
    }

    if (this.tankRecoil > 0) {
      this.tankRecoil -= delta * 0.15;
      this.tank.x = (this.cameras.main.width * 0.25) - this.tankRecoil;
    } else {
      this.tank.x = this.cameras.main.width * 0.25;
    }

    if (this.projectileActive) {
      this.projectileX += delta * 0.5;
      this.projectile.clear();
      
      const trailLength = 20;
      for (let i = 0; i < trailLength; i++) {
        const alpha = 1 - (i / trailLength);
        const offsetX = -i * 2;
        this.projectile.fillStyle(0xffaa00, alpha * 0.8);
        this.projectile.fillCircle(this.projectileX + offsetX, this.projectileY, 3 - (i * 0.1));
      }
      this.projectile.fillStyle(0xffff00, 1);
      this.projectile.fillCircle(this.projectileX, this.projectileY, 4);
      
      if (this.projectileX > this.cameras.main.width * 0.5) {
        this.projectileActive = false;
        this.projectile.setVisible(false);
        this.triggerExplosion();
      }
    }
  }

  private fireSequence() {
    this.isFiring = true;
    
    this.tankRecoil = 10;
    
    const muzzleX = this.tank.x + 35;
    const muzzleY = this.tank.y - 2;
    
    this.muzzleFlash.setPosition(muzzleX, muzzleY);
    this.muzzleFlash.setVisible(true);
    this.muzzleFlash.play('muzzle_flash');
    
    this.smokeParticles.emitParticleAt(muzzleX, muzzleY, 5);
    
    this.time.delayedCall(100, () => {
      this.muzzleFlash.setVisible(false);
    });

    this.projectileX = muzzleX;
    this.projectileY = muzzleY;
    this.projectile.setVisible(true);
    this.projectileActive = true;

    this.time.delayedCall(300, () => {
      this.roverDodge();
    });

    this.time.delayedCall(800, () => {
      this.isFiring = false;
    });
  }

  private roverDodge() {
    const targetX = this.roverStartX + Phaser.Math.Between(-30, 30);
    const targetY = this.roverStartY + Phaser.Math.Between(-20, 20);
    
    this.tweens.add({
      targets: this.rover,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(500, () => {
          this.tweens.add({
            targets: this.rover,
            x: this.roverStartX,
            y: this.roverStartY,
            duration: 300,
            ease: 'Power2',
          });
        });
      },
    });

    this.smokeParticles.emitParticleAt(this.rover.x, this.rover.y + 10, 3);
  }

  private triggerExplosion() {
    const explosionX = this.cameras.main.width * 0.5;
    const explosionY = this.cameras.main.height * 0.5;
    
    this.explosion.setPosition(explosionX, explosionY);
    this.explosion.setVisible(true);
    this.explosion.play('explosion');
    
    this.cameras.main.shake(200, 0.01);
    
    this.smokeParticles.emitParticleAt(explosionX, explosionY, 15);
    
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 0.8);
    flash.fillCircle(explosionX, explosionY, 50);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 200,
      onComplete: () => flash.destroy(),
    });

    this.time.delayedCall(400, () => {
      this.explosion.setVisible(false);
    });
  }
}
