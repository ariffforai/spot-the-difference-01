// Game state: levels, timer, score, hints and the win/lose flow.
//
// One state object owns everything the renderer and the input handler need.
// The timer only ticks while status is 'playing'; screenshot staging (shots.js)
// freezes it by setting status to 'staged'.
import { LEVELS } from './differences.js';

export const POINTS_PER_FIND = 100;
export const HINT_COST = 50;
export const MISS_PENALTY_SECONDS = 5;
export const MAX_HINTS_PER_LEVEL = 3;

/** A fresh state for the given level (0-based). */
export function createGameState(levelIndex = 0) {
  const level = LEVELS[levelIndex];
  return {
    levelIndex,
    level,
    found: new Set(),
    foundOrder: [],
    score: 0,
    totalScore: 0,
    timeLeft: level.timeLimit,
    hintsLeft: MAX_HINTS_PER_LEVEL,
    misses: 0,
    finds: 0,
    status: 'playing', // playing | levelComplete | gameComplete | timeUp | staged
    message: `Find ${level.differences.length} differences — click one!`,
    messageUntil: 0,
    hintDiff: null,
    hintUntil: 0,
    shakeUntil: 0,
    missFlash: null,
    particles: [],
    now: 0,
  };
}

/** Differences still unfound in the current level. */
export function remainingDifferences(state) {
  return state.level.differences.filter((d) => !state.found.has(d.id));
}

/** How many differences are left to find in the current level. */
export function remainingCount(state) {
  return state.level.differences.length - state.found.size;
}

/** Record a found difference: score, particles and the win check. */
export function markFound(state, diff) {
  if (state.found.has(diff.id)) return false;
  state.found.add(diff.id);
  state.foundOrder.push(diff.id);
  state.finds += 1;
  const timeBonus = Math.max(0, Math.floor(state.timeLeft / 10)) * 5;
  const gained = POINTS_PER_FIND + timeBonus;
  state.score += gained;
  state.totalScore += gained;
  state.message = `Found: ${diff.label}! +${gained} points`;
  state.messageUntil = state.now + 2.5;
  spawnBurst(state, diff);
  if (state.found.size === state.level.differences.length) {
    state.status = state.levelIndex === LEVELS.length - 1 ? 'gameComplete' : 'levelComplete';
    state.message = state.status === 'gameComplete'
      ? 'You found all 30 differences — Pasar Malam champion!'
      : `Level clear! ${state.level.name} complete.`;
  }
  return true;
}

/** A wrong click: a short shake, a red flash and a time penalty. */
export function markMiss(state, x, y) {
  state.misses += 1;
  state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SECONDS);
  state.shakeUntil = state.now + 0.35;
  state.missFlash = { x, y, until: state.now + 0.6 };
  state.message = `Not a difference — minus ${MISS_PENALTY_SECONDS} seconds!`;
  state.messageUntil = state.now + 2;
  if (state.timeLeft <= 0) state.status = 'timeUp';
}

/** Spend a hint: briefly circle one unfound difference on both panels. */
export function useHint(state) {
  if (state.status !== 'playing' || state.hintsLeft <= 0) return false;
  const left = remainingDifferences(state);
  if (left.length === 0) return false;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.totalScore = Math.max(0, state.totalScore - HINT_COST);
  state.hintDiff = left[Math.floor(left.length / 2)];
  state.hintUntil = state.now + 2.5;
  state.message = `Hint: look near the ${state.hintDiff.label.toLowerCase()}… (−${HINT_COST} pts)`;
  state.messageUntil = state.now + 2.5;
  return true;
}

/** Move to the next level, keeping the running total score. */
export function nextLevel(state) {
  const next = createGameState(state.levelIndex + 1);
  next.totalScore = state.totalScore;
  return next;
}

/** Restart the current level from scratch, keeping points banked earlier. */
export function restartLevel(state) {
  const fresh = createGameState(state.levelIndex);
  fresh.totalScore = state.totalScore - state.score;
  return fresh;
}

/** Restart the whole game from level 1. */
export function restartGame() {
  return createGameState(0);
}

/** One burst of golden sparks at a found difference, on both panels. */
export function spawnBurst(state, diff) {
  for (let i = 0; i < 14; i += 1) {
    const angle = (i / 14) * Math.PI * 2;
    state.particles.push({
      x: diff.x, y: diff.y,
      vx: Math.cos(angle) * (30 + (i % 4) * 14),
      vy: Math.sin(angle) * (30 + (i % 4) * 14) - 20,
      life: 0.7, maxLife: 0.7,
      colour: ['#ffd166', '#ff6b6b', '#4ecdc4'][i % 3],
    });
  }
}

/** Advance the clock, the timer, particles and expiring effects. */
export function tick(state, dt) {
  state.now += dt;
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 90 * dt;
    p.life -= dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
  if (state.status !== 'playing') return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.status = 'timeUp';
    state.message = 'Time up! The stalls are closing…';
  }
}

/** Stars earned for a cleared level: 3 for fast, 2 for steady, 1 for scraping through. */
export function starsForLevel(state) {
  if (state.status !== 'levelComplete' && state.status !== 'gameComplete') return 0;
  if (state.misses === 0 && state.timeLeft > 60) return 3;
  if (state.misses <= 2) return 2;
  return 1;
}
