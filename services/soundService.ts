// Lightweight synthesized sound effects using WebAudio.
// No audio assets needed, so the game stays fully playable offline.

let ctx: AudioContext | null = null;
let muted = false;
try {
  muted = localStorage.getItem('jh-sound-muted') === '1';
} catch {
  // storage unavailable
}

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

export const isSfxMuted = () => muted;
export const setSfxMuted = (m: boolean) => {
  muted = m;
  try {
    localStorage.setItem('jh-sound-muted', m ? '1' : '0');
  } catch {
    // ignore
  }
};

const tone = (
  freq: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.12,
  delay = 0,
  slideTo?: number
) => {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
};

// Filtered noise burst — used for the page-turn whoosh
const swoosh = (dur: number, vol: number, fromFreq: number, toFreq: number) => {
  const c = getCtx();
  if (!c || muted) return;
  const t0 = c.currentTime;
  const frames = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(fromFreq, t0);
  filter.frequency.exponentialRampToValueAtTime(toFreq, t0 + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t0);
};

export const sfx = {
  /** Soft UI click for advancing text and pressing buttons */
  click: () => tone(520, 0.07, 'triangle', 0.07),
  /** Page-turn whoosh for scene transitions */
  pageTurn: () => swoosh(0.3, 0.18, 350, 1400),
  /** Two-note chime when a History Fact is discovered */
  fact: () => {
    tone(880, 0.14, 'sine', 0.1);
    tone(1318.5, 0.3, 'sine', 0.1, 0.11);
  },
  /** Little fanfare arpeggio for a new badge */
  badge: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.34, 'triangle', 0.09, i * 0.12));
  },
  /** Metallic ring for the coin flip */
  coin: () => {
    tone(1150, 0.5, 'square', 0.035);
    tone(1218, 0.5, 'square', 0.035);
    tone(1830, 0.2, 'sine', 0.07);
  },
  /** Quiz feedback */
  correct: () => {
    tone(659.25, 0.12, 'sine', 0.11);
    tone(987.77, 0.3, 'sine', 0.11, 0.1);
  },
  wrong: () => tone(196, 0.35, 'sawtooth', 0.06, 0, 130),
};
