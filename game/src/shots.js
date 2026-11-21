// Screenshot staging behind ?shot=cover|play|level|win.
//
// Each shot freezes a real game state mid-hunt — the same state a player
// reaches by clicking — so the screenshots are honest renders of the game's
// own code: markers on the differences already found, several still unfound,
// and the counter, timer and score all visible. The frozen state never ticks,
// so the same URL always gives the same frame.
//
//   cover — Level 3 (Lantern Garden), 6 of 12 found, the busiest scene
//   play  — Level 2 (Kuih Rainbow), 4 of 10 found
//   level — Level 1 (Satay Smoke), 3 of 8 found with a hint ring showing
//   win   — Level 3, all 12 found, the champion overlay up
import { LEVELS } from './differences.js';
import { createGameState, markFound } from './state.js';

/** The differences to pre-find for each staged shot, by id. */
const STAGED_FINDS = {
  cover: ['house-window', 'lantern-row', 'bicycle', 'well-roof', 'flower-bed', 'fence'],
  play: ['bunting', 'kuih-layer', 'kuih-jar', 'teapot'],
  level: ['moon', 'lantern', 'skewer'],
  win: null, // win finds every difference in the level
};

/** Build the frozen state for a shot name; unknown names stage the cover. */
export function stageShot(name) {
  const levelIndex = name === 'play' ? 1 : name === 'level' ? 0 : 2;
  const state = createGameState(levelIndex);
  const wanted = name === 'win'
    ? LEVELS[levelIndex].differences.map((d) => d.id)
    : (STAGED_FINDS[name] ?? STAGED_FINDS.cover);
  for (const id of wanted) {
    const diff = LEVELS[levelIndex].differences.find((d) => d.id === id);
    if (diff) markFound(state, diff);
  }
  if (name === 'level') {
    const hinted = LEVELS[0].differences.find((d) => d.id === 'cat');
    state.hintDiff = hinted ?? null;
    state.hintUntil = 999;
    state.hintsLeft = 2;
    state.message = 'Hint: look near the stall cat… (−50 pts)';
  } else if (name === 'win') {
    state.message = 'You found all 30 differences — Pasar Malam champion!';
  } else {
    const remaining = LEVELS[levelIndex].differences.length - state.found.size;
    state.message = `${remaining} differences still hiding — can you spot them all?`;
  }
  state.timeLeft = name === 'cover' ? 127 : name === 'play' ? 98 : name === 'level' ? 143 : 64;
  // The win shot keeps its gameComplete status so the champion overlay draws;
  // the other shots freeze as 'staged' so the timer never ticks in the frame.
  if (name !== 'win') state.status = 'staged';
  state.now = 1.5;
  return state;
}
