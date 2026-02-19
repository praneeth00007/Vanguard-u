// Pixel Art Sprite Generator for 16-bit style vehicles and effects
import * as Phaser from 'phaser';

export class SpriteGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  generateAll() {
    this.generateTankSprites();
    this.generateRoverSprites();
    this.generateExplosionSprites();
    this.generateMuzzleFlashSprites();
    this.generateSmokeSprites();
    this.generateProjectileSprites();
  }

  private generateTankSprites() {
    const frameWidth = 64;
    const frameHeight = 48;
    
    // Tank idle frames (4 frames with subtle vibration)
    for (let frame = 0; frame < 4; frame++) {
      const graphics = this.scene.make.graphics({ x: 0, y: 0 });
      const offsetY = frame % 2 === 0 ? 0 : 1;
      
      this.drawTank(graphics, frameWidth * frame, frameHeight * 0, offsetY, false);
    }
    
    // Create texture from the combined spritesheet
    const canvas = this.scene.textures.createCanvas('tank_sheet', frameWidth * 4, frameHeight * 2);
    if (canvas) {
      const graphics = this.scene.make.graphics({ x: 0, y: 0 });
      
      // Idle frames
      for (let frame = 0; frame < 4; frame++) {
        const offsetY = frame % 2 === 0 ? 0 : 1;
        this.drawTank(graphics, frameWidth * frame, 0, offsetY, false);
      }
      
      // Fire frames
      for (let frame = 0; frame < 4; frame++) {
        const recoil = frame < 2 ? frame * 2 : (3 - frame) * 2;
        this.drawTank(graphics, frameWidth * frame, frameHeight, 0, true, recoil);
      }
      
      graphics.generateTexture('tank_sheet', frameWidth * 4, frameHeight * 2);
      graphics.destroy();
    }
  }

  private drawTank(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    offsetY: number,
    isFiring: boolean,
    recoil: number = 0
  ) {
    const baseX = x + recoil;
    const baseY = y + offsetY;
    
    // Tank body - main hull
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillRoundedRect(baseX + 2, baseY + 8, 60, 32, 4);
    
    // Tracks
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(baseX + 4, baseY + 6, 56, 8);
    graphics.fillRect(baseX + 4, baseY + 34, 56, 8);
    
    // Track details
    graphics.fillStyle(0x2a2a2a, 1);
    for (let i = 0; i < 7; i++) {
      graphics.fillRect(baseX + 6 + i * 8, baseY + 7, 4, 6);
      graphics.fillRect(baseX + 6 + i * 8, baseY + 35, 4, 6);
    }
    
    // Upper hull
    graphics.fillStyle(0x4a5a4a, 1);
    graphics.fillRect(baseX + 8, baseY + 14, 48, 20);
    
    // Armor plates
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillRect(baseX + 10, baseY + 16, 10, 8);
    graphics.fillRect(baseX + 44, baseY + 16, 10, 8);
    
    // Turret base
    graphics.fillStyle(0x4a5a4a, 1);
    graphics.fillCircle(baseX + 32, baseY + 24, 12);
    graphics.fillStyle(0x3a4a3a, 1);
    graphics.fillCircle(baseX + 32, baseY + 24, 8);
    
    // Main cannon
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(baseX + 40, baseY + 22, 20, 4);
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(baseX + 60, baseY + 24, 3);
    
    // Muzzle flash when firing
    if (isFiring) {
      graphics.fillStyle(0xffaa00, 0.9);
      graphics.fillCircle(baseX + 62, baseY + 24, 6);
      graphics.fillStyle(0xffff00, 1);
      graphics.fillCircle(baseX + 62, baseY + 24, 3);
    }
    
    // Headlight
    graphics.fillStyle(0xffcc44, 1);
    graphics.fillCircle(baseX + 60, baseY + 18, 2);
    
    // Exhaust ports
    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(baseX + 2, baseY + 12, 4, 4);
    graphics.fillRect(baseX + 2, baseY + 32, 4, 4);
    
    // Detail lines
    graphics.lineStyle(1, 0x2a3a2a, 1);
    graphics.strokeRoundedRect(baseX + 2, baseY + 8, 60, 32, 4);
  }

  private generateRoverSprites() {
    const frameWidth = 48;
    const frameHeight = 32;
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    // Drift frames (6 frames)
    for (let frame = 0; frame < 6; frame++) {
      this.drawRover(graphics, frameWidth * frame, frameHeight * 0, frame);
    }
    
    // Fire frames (4 frames)
    for (let frame = 0; frame < 4; frame++) {
      this.drawRover(graphics, frameWidth * frame, frameHeight, 0, frame % 2 === 0);
    }
    
    graphics.generateTexture('rover_sheet', frameWidth * 6, frameHeight * 2);
    graphics.destroy();
  }

  private drawRover(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    driftFrame: number,
    isFiring: boolean = false
  ) {
    const driftOffset = Math.sin(driftFrame * Math.PI / 3) * 2;
    
    // Body
    graphics.fillStyle(0x4a3a2a, 1);
    graphics.fillRoundedRect(x + 4, y + 6 + driftOffset, 40, 20, 3);
    
    // Armor plates
    graphics.fillStyle(0x5a4a3a, 1);
    graphics.fillRect(x + 8, y + 8 + driftOffset, 8, 6);
    graphics.fillRect(x + 32, y + 8 + driftOffset, 8, 6);
    
    // Cockpit
    graphics.fillStyle(0x3a2a1a, 1);
    graphics.fillRect(x + 16, y + 10 + driftOffset, 16, 12);
    
    // Windshield
    graphics.fillStyle(0x2a4a5a, 0.8);
    graphics.fillRect(x + 18, y + 12 + driftOffset, 12, 6);
    
    // Wheels
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(x + 10, y + 26, 5);
    graphics.fillCircle(x + 38, y + 26, 5);
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillCircle(x + 10, y + 26, 3);
    graphics.fillCircle(x + 38, y + 26, 3);
    
    // Turret
    graphics.fillStyle(0x3a3a3a, 1);
    graphics.fillCircle(x + 24, y + 6 + driftOffset, 6);
    
    // Machine gun
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(x + 26, y + 4 + driftOffset, 14, 3);
    
    // Muzzle flash
    if (isFiring) {
      graphics.fillStyle(0xffaa00, 1);
      graphics.fillCircle(x + 42, y + 5 + driftOffset, 4);
      graphics.fillStyle(0xffff00, 1);
      graphics.fillCircle(x + 42, y + 5 + driftOffset, 2);
    }
    
    // Headlights
    graphics.fillStyle(0xffcc66, 1);
    graphics.fillCircle(x + 44, y + 10 + driftOffset, 2);
    
    // Exhaust
    graphics.fillStyle(0x333333, 1);
    graphics.fillCircle(x + 4, y + 14 + driftOffset, 2);
  }

  private generateExplosionSprites() {
    const frameWidth = 32;
    const frameHeight = 32;
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    for (let frame = 0; frame < 8; frame++) {
      this.drawExplosion(graphics, frameWidth * frame, 0, frame);
    }
    
    graphics.generateTexture('explosion_sheet', frameWidth * 8, frameHeight);
    graphics.destroy();
  }

  private drawExplosion(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    frame: number
  ) {
    const progress = frame / 7;
    const radius = 4 + progress * 12;
    const alpha = 1 - progress * 0.3;
    
    // Outer glow
    graphics.fillStyle(0xff4400, alpha * 0.5);
    graphics.fillCircle(x + 16, y + 16, radius + 4);
    
    // Main explosion
    graphics.fillStyle(0xff6600, alpha * 0.8);
    graphics.fillCircle(x + 16, y + 16, radius);
    
    // Core
    graphics.fillStyle(0xffaa00, alpha);
    graphics.fillCircle(x + 16, y + 16, radius * 0.6);
    
    // Bright center
    graphics.fillStyle(0xffff00, alpha);
    graphics.fillCircle(x + 16, y + 16, radius * 0.3);
    
    // Debris particles
    if (frame > 1 && frame < 6) {
      const debrisCount = 4;
      for (let i = 0; i < debrisCount; i++) {
        const angle = (i / debrisCount) * Math.PI * 2;
        const dist = radius + frame * 2;
        const px = x + 16 + Math.cos(angle) * dist;
        const py = y + 16 + Math.sin(angle) * dist;
        graphics.fillStyle(0xff6600, alpha * 0.7);
        graphics.fillCircle(px, py, 2);
      }
    }
  }

  private generateMuzzleFlashSprites() {
    const frameWidth = 24;
    const frameHeight = 24;
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    for (let frame = 0; frame < 4; frame++) {
      this.drawMuzzleFlash(graphics, frameWidth * frame, 0, frame);
    }
    
    graphics.generateTexture('muzzle_flash_sheet', frameWidth * 4, frameHeight);
    graphics.destroy();
  }

  private drawMuzzleFlash(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    frame: number
  ) {
    const size = 8 + (3 - frame) * 2;
    const alpha = 1 - frame * 0.2;
    
    // Outer flash
    graphics.fillStyle(0xff4400, alpha * 0.6);
    graphics.fillCircle(x + 12, y + 12, size + 2);
    
    // Main flash
    graphics.fillStyle(0xffaa00, alpha * 0.9);
    graphics.fillCircle(x + 12, y + 12, size);
    
    // Core
    graphics.fillStyle(0xffff00, alpha);
    graphics.fillCircle(x + 12, y + 12, size * 0.5);
    
    // Rays
    graphics.lineStyle(2, 0xffaa00, alpha);
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      graphics.beginPath();
      graphics.moveTo(x + 12, y + 12);
      graphics.lineTo(
        x + 12 + Math.cos(angle) * (size + 4),
        y + 12 + Math.sin(angle) * (size + 4)
      );
      graphics.strokePath();
    }
  }

  private generateSmokeSprites() {
    const frameWidth = 16;
    const frameHeight = 16;
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    for (let frame = 0; frame < 6; frame++) {
      this.drawSmoke(graphics, frameWidth * frame, 0, frame);
    }
    
    graphics.generateTexture('smoke_sheet', frameWidth * 6, frameHeight);
    graphics.destroy();
  }

  private drawSmoke(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    frame: number
  ) {
    const size = 4 + frame;
    const alpha = 0.8 - frame * 0.1;
    
    // Main smoke puff
    graphics.fillStyle(0x666666, alpha);
    graphics.fillCircle(x + 8, y + 8, size);
    
    // Secondary puff
    graphics.fillStyle(0x555555, alpha * 0.8);
    graphics.fillCircle(x + 10, y + 6, size * 0.7);
    
    // Core darker
    graphics.fillStyle(0x444444, alpha * 0.6);
    graphics.fillCircle(x + 8, y + 8, size * 0.5);
  }

  private generateProjectileSprites() {
    const frameWidth = 8;
    const frameHeight = 8;
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    // Single projectile sprite
    graphics.fillStyle(0xffaa00, 1);
    graphics.fillCircle(4, 4, 3);
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(4, 4, 2);
    
    graphics.generateTexture('projectile', frameWidth, frameHeight);
    graphics.destroy();
  }

  createTankAnimations(scene: Phaser.Scene) {
    // Tank idle animation
    if (!scene.anims.exists('tank_idle')) {
      scene.anims.create({
        key: 'tank_idle',
        frames: [
          { key: 'tank_sheet', frame: 0 },
          { key: 'tank_sheet', frame: 1 },
          { key: 'tank_sheet', frame: 2 },
          { key: 'tank_sheet', frame: 3 },
        ],
        frameRate: 8,
        repeat: -1,
      });
    }

    // Tank fire animation
    if (!scene.anims.exists('tank_fire')) {
      scene.anims.create({
        key: 'tank_fire',
        frames: [
          { key: 'tank_sheet', frame: 4 },
          { key: 'tank_sheet', frame: 5 },
          { key: 'tank_sheet', frame: 6 },
          { key: 'tank_sheet', frame: 7 },
        ],
        frameRate: 15,
        repeat: 0,
      });
    }
  }

  createRoverAnimations(scene: Phaser.Scene) {
    // Rover drift animation
    if (!scene.anims.exists('rover_drift')) {
      scene.anims.create({
        key: 'rover_drift',
        frames: [
          { key: 'rover_sheet', frame: 0 },
          { key: 'rover_sheet', frame: 1 },
          { key: 'rover_sheet', frame: 2 },
          { key: 'rover_sheet', frame: 3 },
          { key: 'rover_sheet', frame: 4 },
          { key: 'rover_sheet', frame: 5 },
        ],
        frameRate: 10,
        repeat: -1,
      });
    }

    // Rover fire animation
    if (!scene.anims.exists('rover_fire')) {
      scene.anims.create({
        key: 'rover_fire',
        frames: [
          { key: 'rover_sheet', frame: 6 },
          { key: 'rover_sheet', frame: 7 },
          { key: 'rover_sheet', frame: 8 },
          { key: 'rover_sheet', frame: 9 },
        ],
        frameRate: 12,
        repeat: 0,
      });
    }
  }

  createExplosionAnimations(scene: Phaser.Scene) {
    if (!scene.anims.exists('explosion_anim')) {
      scene.anims.create({
        key: 'explosion_anim',
        frames: Array.from({ length: 8 }, (_, i) => ({ key: 'explosion_sheet', frame: i })),
        frameRate: 20,
        repeat: 0,
      });
    }
  }

  createMuzzleFlashAnimations(scene: Phaser.Scene) {
    if (!scene.anims.exists('muzzle_flash_anim')) {
      scene.anims.create({
        key: 'muzzle_flash_anim',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: 'muzzle_flash_sheet', frame: i })),
        frameRate: 30,
        repeat: 0,
      });
    }
  }

  createSmokeAnimations(scene: Phaser.Scene) {
    if (!scene.anims.exists('smoke_anim')) {
      scene.anims.create({
        key: 'smoke_anim',
        frames: Array.from({ length: 6 }, (_, i) => ({ key: 'smoke_sheet', frame: i })),
        frameRate: 8,
        repeat: -1,
      });
    }
  }
}
