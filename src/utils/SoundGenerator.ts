// Web Audio API Sound Generator for retro game sounds

class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.initialized = true;
  }

  private createOscillator(
    frequency: number,
    type: OscillatorType,
    duration: number,
    volume: number = 0.3,
    detune: number = 0
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.detune.setValueAtTime(detune, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  cannonFire() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    // Low frequency boom
    this.createOscillator(80, 'sawtooth', 0.3, 0.4);
    this.createOscillator(60, 'square', 0.2, 0.3);
    
    // High frequency crack
    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.15, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (buffer.length * 0.1));
    }
    noise.buffer = buffer;
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    noise.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);
    noise.start();
  }

  machineGun() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createOscillator(200 + Math.random() * 100, 'square', 0.05, 0.2);
        this.createOscillator(400, 'sawtooth', 0.03, 0.1);
      }, i * 80);
    }
  }

  explosion() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    // Deep boom
    this.createOscillator(40, 'sawtooth', 0.5, 0.5);
    this.createOscillator(30, 'square', 0.4, 0.4);

    // Noise burst
    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.4, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      const envelope = Math.exp(-i / (buffer.length * 0.2));
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    noise.buffer = buffer;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);
    noise.start();
  }

  ambientBattlefield() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    // Distant rumble
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(30, this.audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 2);
  }

  engineIdle() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(55, this.audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  launchSound() {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    // Ambient drone at launch
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(55, this.audioContext.currentTime);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(110, this.audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(this.audioContext.currentTime + 3);
    oscillator2.stop(this.audioContext.currentTime + 3);
  }
}

export const soundGenerator = new SoundGenerator();
