// ============================================
// АУДИО СИСТЕМА: Web Audio API
// ============================================

class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;

  init() {
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API не поддерживается');
      this.enabled = false;
    }
  }

  // Писк POST (beep)
  playPOSTBeep(frequency = 1000, duration = 0.15) {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = frequency;
    gain.gain.value = 0.2;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Звук вставки детали (щелчок)
  playInsertSound() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Звук включения ПК
  playBootSound() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    // Постепенный запуск вентилятора
    const noise = this.createNoise(2);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 1.5);
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    // POST beep
    setTimeout(() => this.playPOSTBeep(1000, 0.1), 500);
    setTimeout(() => this.playPOSTBeep(1200, 0.1), 700);
  }

  // Звук ошибки
  playErrorSound() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 200;
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // Звук шума кулера (постоянный)
  private fanOscillators: OscillatorNode[] = [];
  startFanSound(rpm = 0.5) {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.stopFanSound();
    const noise = this.createNoise(3);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300 + rpm * 500;
    filter.Q.value = 2;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.02 + rpm * 0.05;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
  }

  stopFanSound() {
    this.fanOscillators.forEach(o => { try { o.stop(); } catch(e){} });
    this.fanOscillators = [];
  }

  // Звук установки ОС
  playInstallSound() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    // Серия коротких beep'ов
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playPOSTBeep(600 + i * 100, 0.08), i * 200);
    }
  }

  // Звук покупки
  playBuySound() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 523; // C5
    gain.gain.value = 0.2;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
    setTimeout(() => {
      const osc2 = this.ctx!.createOscillator();
      const gain2 = this.ctx!.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 659; // E5
      gain2.gain.value = 0.2;
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.2);
      osc2.connect(gain2);
      gain2.connect(this.masterGain!);
      osc2.start();
      osc2.stop(this.ctx!.currentTime + 0.2);
    }, 150);
  }

  // Звук шагов
  playFootstep() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const noise = this.createNoise(0.05);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.05;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
  }

  // Генерация шума
  private createNoise(duration: number): AudioBufferSourceNode {
    const bufferSize = this.ctx!.sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx!.createBufferSource();
    source.buffer = buffer;
    source.start();
    return source;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.3 : 0;
    }
    return this.enabled;
  }
}

export const audioSystem = new AudioSystem();
