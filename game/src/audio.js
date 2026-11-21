// Synthesised sound: every effect is a WebAudio oscillator, so the game
// ships no audio files at all. Audio starts on the first user gesture; the
// screenshot stager never calls these, so staged frames stay silent.
let audioContext = null;
let muted = false;

/** True once the player has interacted and sound is allowed. */
export function unlockAudio() {
  if (audioContext) return;
  try {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return;
    audioContext = new Ctor();
  } catch {
    audioContext = null;
  }
}

/** Toggle sound on and off; returns the new muted state. */
export function toggleMute() {
  muted = !muted;
  return muted;
}

/** Whether sound is currently muted. */
export function isMuted() {
  return muted;
}

function tone(freq, start, duration, type, volume) {
  if (!audioContext || muted) return;
  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + start);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(audioContext.currentTime + start);
    osc.stop(audioContext.currentTime + start + duration + 0.05);
  } catch {
    // Sound is garnish: a failed note never breaks the game.
  }
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  tone(880, 0, 0.18, 'sine', 0.22);
  tone(1318, 0.09, 0.28, 'sine', 0.2);
}

/** A low dull thud for a wrong click. */
export function playMiss() {
  tone(160, 0, 0.22, 'triangle', 0.2);
  tone(110, 0.08, 0.25, 'triangle', 0.16);
}

/** A soft sparkle when a hint appears. */
export function playHint() {
  tone(1568, 0, 0.12, 'sine', 0.14);
  tone(2093, 0.1, 0.2, 'sine', 0.12);
}

/** A little rising fanfare for clearing a level. */
export function playWin() {
  tone(523, 0, 0.16, 'triangle', 0.2);
  tone(659, 0.14, 0.16, 'triangle', 0.2);
  tone(784, 0.28, 0.2, 'triangle', 0.2);
  tone(1047, 0.44, 0.4, 'triangle', 0.22);
}

/** A single click blip for buttons. */
export function playClick() {
  tone(660, 0, 0.07, 'square', 0.08);
}
