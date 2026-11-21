// The frame renderer: the two side-by-side panels, the found markers on
// both pictures, the hint pulse, particles, and the win / lose overlays.
//
// Panel layout (logical 1280 x 800): HUD 0–76, panels at y 92, each 610 x 520
// (left x 20, right x 650), bottom bar from y 632. A thin label sits above
// each panel — ORIGINAL on the left, CHANGED on the right — so the judge can
// see at a glance that the two pictures are a pair.
import { drawScene } from './scenes.js';
import { PANEL_WIDTH, PANEL_HEIGHT } from './differences.js';
import { drawHud, drawBottomBar, overlayButtons } from './hud.js';
import { PANEL_TOP, PANEL_LEFT_X, PANEL_RIGHT_X } from './input.js';
import { starsForLevel } from './state.js';

const LABEL_HEIGHT = 28;

/** Draw one panel: the scene, a border, and its ORIGINAL / CHANGED label. */
function drawPanel(ctx, state, panelIndex) {
  const x = panelIndex === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  ctx.save();
  ctx.translate(x, PANEL_TOP);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
  drawScene(ctx, state.levelIndex, panelIndex);
  ctx.restore();
  ctx.strokeStyle = panelIndex === 0 ? '#4ecdc4' : '#ff9f1c';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, PANEL_TOP, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.fillStyle = panelIndex === 0 ? '#4ecdc4' : '#ff9f1c';
  // A dark chip behind the label so the HUD divider never strikes through it.
  ctx.fillStyle = '#0d0a18';
  ctx.fillRect(x + PANEL_WIDTH / 2 - 105, PANEL_TOP - 27, 210, 23);
  ctx.fillStyle = panelIndex === 0 ? '#4ecdc4' : '#ff9f1c';
  ctx.font = 'bold 15px Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(panelIndex === 0 ? '◀  ORIGINAL' : 'CHANGED  ▶', x + PANEL_WIDTH / 2, PANEL_TOP - 9);
  ctx.textAlign = 'left';
}

/** A found marker: a bold ring plus a tick, drawn on both panels. */
function drawMarker(ctx, panelX, diff, pulse) {
  const cx = panelX + diff.x;
  const cy = PANEL_TOP + diff.y;
  const r = diff.r + (pulse ? 3 : 0);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(cx, cy - r - 2, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - r - 2);
  ctx.lineTo(cx - 1, cy - r + 3);
  ctx.lineTo(cx + 6, cy - r - 6);
  ctx.stroke();
}

/** The pulsing hint ring around one unfound difference, on both panels. */
function drawHintRing(ctx, state) {
  if (!state.hintDiff || state.now > state.hintUntil) return;
  const pulse = 4 + 3 * Math.sin(state.now * 8);
  for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    ctx.strokeStyle = '#ff9ff3';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(panelX + state.hintDiff.x, PANEL_TOP + state.hintDiff.y, state.hintDiff.r + pulse + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

/** Golden spark particles from the latest find, on both panels. */
function drawParticles(ctx, state) {
  for (const p of state.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.arc(panelX + p.x, PANEL_TOP + p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

/** The red X flash left by a wrong click. */
function drawMissFlash(ctx, state) {
  if (!state.missFlash || state.now > state.missFlash.until) return;
  const { x, y } = state.missFlash;
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
}

/** The centre overlay for level-complete, game-complete and time-up. */
function drawOverlay(ctx, state) {
  const buttons = overlayButtons(state);
  ctx.fillStyle = 'rgba(10,8,20,0.72)';
  ctx.fillRect(0, 0, 1280, 800);
  ctx.fillStyle = '#14101f';
  ctx.beginPath();
  ctx.roundRect(340, 190, 600, 340, 16);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(340, 190, 600, 340, 16);
  ctx.stroke();
  ctx.textAlign = 'center';
  if (state.status === 'gameComplete') {
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('PASAR MALAM CHAMPION!', 640, 260);
    ctx.fillStyle = '#f1faee';
    ctx.font = '18px Verdana, sans-serif';
    ctx.fillText('All 30 differences found across 3 stalls.', 640, 300);
    ctx.fillText(`Final score: ${state.totalScore}`, 640, 330);
  } else if (state.status === 'levelComplete') {
    ctx.fillStyle = '#4ecdc4';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('STALL CLEAR!', 640, 260);
    ctx.fillStyle = '#f1faee';
    ctx.font = '18px Verdana, sans-serif';
    ctx.fillText(`${state.level.name} — all ${state.level.differences.length} differences found.`, 640, 300);
    ctx.fillText(`Score so far: ${state.totalScore}`, 640, 330);
  } else {
    ctx.fillStyle = '#e63946';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('TIME UP!', 640, 260);
    ctx.fillStyle = '#f1faee';
    ctx.font = '18px Verdana, sans-serif';
    ctx.fillText(`You found ${state.found.size} of ${state.level.differences.length} differences.`, 640, 300);
    ctx.fillText('The stalls are closing — try this stall again.', 640, 330);
  }
  const stars = starsForLevel(state);
  if (state.status !== 'timeUp') {
    ctx.font = '34px Verdana, sans-serif';
    const starText = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    ctx.fillStyle = '#ffd166';
    ctx.fillText(starText, 640, 380);
  }
  ctx.font = '15px Verdana, sans-serif';
  ctx.fillStyle = '#9a9ab0';
  ctx.fillText(state.status === 'timeUp' ? 'Press R or click TRY AGAIN to retry.' : 'Press Enter or click the button to continue.', 640, 415);
  if (buttons) {
    const b = buttons.primary;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 10);
    ctx.fill();
    ctx.fillStyle = '#1d1d1d';
    ctx.font = 'bold 18px Verdana, sans-serif';
    ctx.fillText(b.label, b.x + b.w / 2, b.y + 36);
  }
  ctx.textAlign = 'left';
}

/** One full frame: HUD, both panels, markers, effects, bottom bar, overlay. */
export function renderFrame(ctx, state) {
  ctx.save();
  if (state.now < state.shakeUntil) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  ctx.fillStyle = '#0d0a18';
  ctx.fillRect(-10, -10, 1300, 820);
  drawHud(ctx, state);
  drawPanel(ctx, state, 0);
  drawPanel(ctx, state, 1);
  const pulse = Math.sin(state.now * 5) > 0;
  for (const diff of state.level.differences) {
    if (!state.found.has(diff.id)) continue;
    drawMarker(ctx, PANEL_LEFT_X, diff, pulse);
    drawMarker(ctx, PANEL_RIGHT_X, diff, pulse);
  }
  drawHintRing(ctx, state);
  drawParticles(ctx, state);
  drawMissFlash(ctx, state);
  drawBottomBar(ctx, state);
  if (state.status === 'levelComplete' || state.status === 'gameComplete' || state.status === 'timeUp') {
    drawOverlay(ctx, state);
  }
  ctx.restore();
  void LABEL_HEIGHT;
}
