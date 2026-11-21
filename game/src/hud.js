// The HUD: the top bar (title, level, found counter, timer, score, buttons)
// and the bottom bar (found checklist, message line, controls legend).
//
// Everything is drawn on the canvas so the screenshots show the whole game
// in one frame, and the button rectangles are exported so input handling and
// drawing can never disagree about where a button is.
import { LEVELS } from './differences.js';
import { remainingCount } from './state.js';

export const HUD_HEIGHT = 76;
export const BOTTOM_TOP = 632;

/** The clickable HUD buttons, in logical coordinates. */
export function hudButtons(state) {
  return {
    hint: { x: 1060, y: 14, w: 96, h: 46, label: `HINT (${state.hintsLeft})` },
    sound: { x: 960, y: 14, w: 86, h: 46, label: 'SOUND' },
    restart: { x: 1162, y: 14, w: 98, h: 46, label: 'RESTART' },
  };
}

/** The overlay buttons shown on level-complete / game-complete / time-up. */
export function overlayButtons(state) {
  if (state.status === 'gameComplete') {
    return { primary: { x: 520, y: 470, w: 240, h: 56, label: 'PLAY AGAIN' } };
  }
  if (state.status === 'levelComplete') {
    return { primary: { x: 520, y: 470, w: 240, h: 56, label: 'NEXT STALL →' } };
  }
  if (state.status === 'timeUp') {
    return { primary: { x: 520, y: 470, w: 240, h: 56, label: 'TRY AGAIN' } };
  }
  return null;
}

function drawButton(ctx, rect, label, enabled) {
  ctx.fillStyle = enabled ? '#ffd166' : '#5a5a6a';
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 8);
  ctx.fill();
  ctx.strokeStyle = '#1d1d1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 8);
  ctx.stroke();
  ctx.fillStyle = '#1d1d1d';
  ctx.font = 'bold 15px Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

/** The top bar: title, level name, FOUND counter, timer bar, score, buttons. */
export function drawHud(ctx, state) {
  ctx.fillStyle = '#14101f';
  ctx.fillRect(0, 0, 1280, HUD_HEIGHT);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(0, HUD_HEIGHT - 4, 1280, 4);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('PASAR MALAM', 20, 32);
  ctx.fillStyle = '#f1faee';
  ctx.font = '15px Verdana, sans-serif';
  ctx.fillText('Spot the Difference', 20, 56);
  // Level pill.
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.roundRect(268, 14, 190, 46, 10);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`LEVEL ${state.levelIndex + 1} / 3`, 363, 33);
  ctx.font = '13px Verdana, sans-serif';
  ctx.fillText(state.level.name, 363, 52);
  // FOUND counter — the big number the judge looks for.
  const remaining = remainingCount(state);
  const total = state.level.differences.length;
  ctx.fillStyle = remaining === 0 ? '#4ecdc4' : '#ffd166';
  ctx.beginPath();
  ctx.roundRect(478, 14, 190, 46, 10);
  ctx.fill();
  ctx.fillStyle = '#1d1d1d';
  ctx.font = 'bold 20px Verdana, sans-serif';
  ctx.fillText(`FOUND ${state.found.size} / ${total}`, 573, 44);
  // Timer bar + seconds.
  const fraction = Math.max(0, state.timeLeft / state.level.timeLimit);
  ctx.fillStyle = '#2a2a3a';
  ctx.beginPath();
  ctx.roundRect(688, 14, 150, 20, 6);
  ctx.fill();
  ctx.fillStyle = fraction > 0.33 ? '#4ecdc4' : '#e63946';
  if (fraction > 0) {
    ctx.beginPath();
    ctx.roundRect(688, 14, 150 * fraction, 20, 6);
    ctx.fill();
  }
  ctx.fillStyle = '#f1faee';
  ctx.font = 'bold 15px Verdana, sans-serif';
  ctx.textAlign = 'left';
  const mins = Math.floor(state.timeLeft / 60);
  const secs = Math.floor(state.timeLeft % 60);
  ctx.fillText(`⏱ ${mins}:${String(secs).padStart(2, '0')}`, 688, 52);
  // Score.
  ctx.fillStyle = '#f1faee';
  ctx.font = 'bold 17px Verdana, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`SCORE ${state.totalScore}`, 950, 44);
  ctx.textAlign = 'left';
  // Buttons.
  const buttons = hudButtons(state);
  drawButton(ctx, buttons.sound, 'SOUND', true);
  drawButton(ctx, buttons.hint, `HINT (${state.hintsLeft})`, state.hintsLeft > 0 && state.status === 'playing');
  drawButton(ctx, buttons.restart, 'RESTART', true);
}

/** The bottom bar: checklist chips, the message line and the controls legend. */
export function drawBottomBar(ctx, state) {
  ctx.fillStyle = '#14101f';
  ctx.fillRect(0, BOTTOM_TOP, 1280, 800 - BOTTOM_TOP);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(0, BOTTOM_TOP, 1280, 3);
  // Checklist chips: one per difference, ticked when found.
  ctx.font = 'bold 12px Verdana, sans-serif';
  ctx.textAlign = 'left';
  let x = 20;
  const y = BOTTOM_TOP + 34;
  for (const diff of state.level.differences) {
    const found = state.found.has(diff.id);
    const label = found ? `✓ ${diff.label}` : `? ${diff.label}`;
    const w = ctx.measureText(label).width + 18;
    if (x + w > 1260) break;
    ctx.fillStyle = found ? '#2a9d8f' : '#2a2a3a';
    ctx.beginPath();
    ctx.roundRect(x, y - 16, w, 26, 8);
    ctx.fill();
    ctx.fillStyle = found ? '#ffffff' : '#9a9ab0';
    ctx.fillText(label, x + 9, y + 2);
    x += w + 8;
  }
  // Message line.
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 16px Verdana, sans-serif';
  ctx.fillText(state.message, 20, BOTTOM_TOP + 74);
  // Controls legend.
  ctx.fillStyle = '#9a9ab0';
  ctx.font = '13px Verdana, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Click a difference  •  H = Hint  •  R = Restart  •  1 / 2 / 3 = Stall  •  M = Sound', 1260, BOTTOM_TOP + 74);
  ctx.textAlign = 'left';
  // Level dots.
  for (let i = 0; i < LEVELS.length; i += 1) {
    ctx.fillStyle = i < state.levelIndex ? '#4ecdc4' : i === state.levelIndex ? '#ffd166' : '#3a3a4a';
    ctx.beginPath();
    ctx.arc(20 + i * 26, BOTTOM_TOP + 108, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#9a9ab0';
  ctx.font = '13px Verdana, sans-serif';
  ctx.fillText(`${state.level.stall} — ${state.level.blurb}`, 110, BOTTOM_TOP + 113);
}
