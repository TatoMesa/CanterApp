/**
 * Servicio de alertas sonoras y hápticas utilizando la API nativa Web Audio y Vibración.
 */
class SoundAlertService {
  constructor() {
    this.audioCtx = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playReadyAlert() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      // Melodía festiva de 3 tonos triunfales (G4, C5, E5)
      const notes = [
        { freq: 392.00, start: 0, duration: 0.15 },
        { freq: 523.25, start: 0.15, duration: 0.15 },
        { freq: 659.25, start: 0.30, duration: 0.40 }
      ];

      notes.forEach(note => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.start);

        gain.gain.setValueAtTime(0.3, now + note.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + note.start);
        osc.stop(now + note.start + note.duration);
      });

      // Vibración de dispositivo en teléfonos móviles (Patrón: vibrar, pausa, vibrar)
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    } catch (e) {
      console.warn('Alerta sonora no disponible:', e);
    }
  }
}

export const soundAlert = new SoundAlertService();
