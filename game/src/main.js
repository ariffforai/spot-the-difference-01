// Pasar Malam: Spot the Difference — boot, game loop and input wiring.
//
// The game is one canvas at a fixed logical size (1280 x 800), scaled by CSS
// to fit the window. ?shot=cover|play|level|win renders one frozen staged
// frame for screenshots; without it the game runs live with a ticking timer.
//
// The live state is exposed as window.__pasarMalam so a play-tester (or an
// automated check) can read the counter and drive clicks through the same
// handler a real player uses.
import { createGameState, tick, markFound, markMiss, useHint, nextLevel, restartLevel, restartGame } from './state.js';
import { renderFrame } from './render.js';
import { hudButtons, overlayButtons } from './hud.js';
import { canvasPoint, pointToScene, hitTestDifference, insideRect } from './input.js';
import { unlockAudio, playFound, playMiss, playHint, playWin, playClick, toggleMute } from './audio.js';
import { stageShot } from './shots.js';
import { LEVELS } from './differences.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusLine = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
let state = shotName ? stageShot(shotName) : createGameState(0);

/** Advance to the next level, or restart the game after the final one. */
function advance() {
  if (state.status === 'levelComplete') {
    state = nextLevel(state);
  } else if (state.status === 'gameComplete' || state.status === 'timeUp') {
    state = state.status === 'timeUp' ? restartLevel(state) : restartGame();
  }
  playClick();
}

/** Handle one click at logical canvas coordinates. */
export function handleClick(point) {
  unlockAudio();
  if (state.status === 'levelComplete' || state.status === 'gameComplete' || state.status === 'timeUp') {
    const buttons = overlayButtons(state);
    if (buttons && insideRect(point, buttons.primary)) {
      advance();
      return true;
    }
    return false;
  }
  if (state.status !== 'playing') return false;
  const buttons = hudButtons(state);
  if (insideRect(point, buttons.hint)) {
    if (useHint(state)) playHint();
    return true;
  }
  if (insideRect(point, buttons.sound)) {
    toggleMute();
    state.message = 'Sound toggled.';
    state.messageUntil = state.now + 2;
    return true;
  }
  if (insideRect(point, buttons.restart)) {
    state = restartLevel(state);
    playClick();
    return true;
  }
  const scene = pointToScene(point);
  if (!scene) return false;
  const diff = hitTestDifference(state, scene);
  if (diff) {
    const wasWin = markFound(state, diff);
    playFound();
    if (state.status === 'levelComplete' || state.status === 'gameComplete') playWin();
    return wasWin;
  }
  markMiss(state, point.x, point.y);
  playMiss();
  return false;
}

/** Keyboard: H hint, R restart, M sound, 1/2/3 stall, Enter advance. */
function handleKey(event) {
  if (event.key === 'Enter' && (state.status === 'levelComplete' || state.status === 'gameComplete' || state.status === 'timeUp')) {
    advance();
    return;
  }
  if (state.status !== 'playing') return;
  const key = event.key.toLowerCase();
  if (key === 'h') {
    unlockAudio();
    if (useHint(state)) playHint();
  } else if (key === 'r') {
    state = restartLevel(state);
    playClick();
  } else if (key === 'm') {
    toggleMute();
  } else if (key === '1' || key === '2' || key === '3') {
    const index = Number(key) - 1;
    if (index < LEVELS.length && index !== state.levelIndex) {
      const kept = state.totalScore;
      state = createGameState(index);
      state.totalScore = kept;
      playClick();
    }
  }
}

canvas.addEventListener('pointerdown', (event) => {
  handleClick(canvasPoint(event, canvas));
});
window.addEventListener('keydown', handleKey);

/** The live loop: tick the timer, then draw. Staged shots draw once. */
let lastTime = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  tick(state, dt);
  renderFrame(ctx, state);
  statusLine.textContent = `Level ${state.levelIndex + 1} ${state.level.name}: found ${state.found.size} of ${state.level.differences.length}, ${state.timeLeft.toFixed(0)} seconds left, score ${state.score}.`;
  requestAnimationFrame(frame);
}

if (shotName) {
  renderFrame(ctx, state);
} else {
  requestAnimationFrame(frame);
}

// Test hook: the same state and click handler the player uses.
window.__pasarMalam = {
  get state() { return state; },
  handleClick,
  advance,
};
