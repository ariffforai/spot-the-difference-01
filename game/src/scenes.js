// The three night-market scenes, drawn entirely in code.
//
// Every scene is painted by ONE function that draws both panels: the left
// panel calls it with variant 0, the right with variant 1, and the
// differences catalogue decides which details change. That is what keeps the
// two pictures near-identical and every difference fair — nothing is pasted
// in afterwards, the variation is part of the drawing itself.
//
// Scene space is 610 x 520 (PANEL_WIDTH x PANEL_HEIGHT in differences.js).
// The renderer translates the context to the panel corner before calling in.
import { LEVELS, isVaried } from './differences.js';

/** Rounded rectangle path helper. */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Filled circle helper. */
function dot(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Four-point sparkle star. */
function sparkle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A paper lantern hanging from a short string. */
function lantern(ctx, x, y, body, glow) {
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - 12);
  ctx.stroke();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = glow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(x - 5, y - 24, 10, 5);
  ctx.fillRect(x - 5, y + 19, 10, 5);
  dot(ctx, x, y, 5, '#fff3c4');
}

/** A glass jar with a coloured lid and contents. */
function jar(ctx, x, y, lid, contents) {
  ctx.fillStyle = contents;
  rr(ctx, x - 16, y - 14, 32, 30, 6);
  ctx.fill();
  ctx.fillStyle = lid;
  rr(ctx, x - 17, y - 20, 34, 9, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x - 11, y - 10, 5, 20);
}

/** A sitting cat silhouette. */
function cat(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 8, y - 16, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 24);
  ctx.lineTo(x + 1, y - 34);
  ctx.lineTo(x + 5, y - 24);
  ctx.closePath();
  ctx.moveTo(x + 12, y - 25);
  ctx.lineTo(x + 16, y - 35);
  ctx.lineTo(x + 19, y - 24);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colour;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 10);
  ctx.quadraticCurveTo(x - 34, y - 4, x - 26, y - 16);
  ctx.stroke();
}

/** Night sky with stars and a warm horizon glow. */
function nightSky(ctx, top, bottom, horizon) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, top);
  sky.addColorStop(1, bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 610, 520);
  const stars = [[40, 30], [120, 70], [200, 26], [300, 60], [380, 28], [470, 80], [560, 30], [90, 120], [250, 110], [430, 130], [500, 170], [160, 150]];
  for (const [sx, sy] of stars) sparkle(ctx, sx, sy, 3, '#fff8d6');
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 300, 610, 220);
}

/** String of warm bulbs across the top of a scene. */
function stringLights(ctx, y) {
  ctx.strokeStyle = '#2c2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y - 14);
  ctx.quadraticCurveTo(305, y + 16, 610, y - 14);
  ctx.stroke();
  const bulbs = ['#ffd166', '#ff7b7b', '#7bd389', '#7bb8ff', '#ffb3d9'];
  for (let i = 0; i < 9; i += 1) {
    const x = 34 + i * 68;
    const by = y - 6 + Math.sin((i / 8) * Math.PI) * 10;
    dot(ctx, x, by, 7, bulbs[i % bulbs.length]);
    dot(ctx, x, by, 11, 'rgba(255,209,102,0.25)');
  }
}

// ---------------------------------------------------------------------------
// Level 1 — Satay Smoke: Pakcik Rahim's satay stall.
// ---------------------------------------------------------------------------
export function drawSatayStall(ctx, variant) {
  const v = (id) => isVaried(0, id, variant);
  nightSky(ctx, '#141b3d', '#3b2a5e', '#2c1e3f');
  // Moon: golden on the left, pale white on the right.
  dot(ctx, 528, 52, 20, v('moon') ? '#f4f1de' : '#ffd166');
  dot(ctx, 522, 46, 5, v('moon') ? '#e0dcc0' : '#e8a93c');
  dot(ctx, 534, 58, 4, v('moon') ? '#e0dcc0' : '#e8a93c');
  stringLights(ctx, 34);
  // Striped awning: one stripe turns green on the right.
  const stripes = ['#e63946', '#f1faee', '#e63946', '#f1faee', '#e63946', '#f1faee'];
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = v('awning') && i === 2 ? '#2a9d8f' : stripes[i];
    ctx.fillRect(10 + i * 100, 58, 100, 52);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(10 + i * 100, 100, 100, 10);
  }
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(10, 110, 590, 8);
  // Hanging lantern: red on the left, green on the right.
  lantern(ctx, 88, 118, v('lantern') ? '#2a9d8f' : '#e63946', '#ffd166');
  // Menu board with the price: RM1 on the left, RM2 on the right.
  ctx.fillStyle = '#2b2118';
  rr(ctx, 408, 150, 130, 92, 8);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  rr(ctx, 408, 150, 130, 92, 8);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('SATAY', 473, 182);
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText(v('price') ? 'RM2' : 'RM1', 473, 214);
  ctx.font = '13px Georgia, serif';
  ctx.fillStyle = '#f1faee';
  ctx.fillText('AYAM • DAGING', 473, 232);
  // Vendor behind the counter: songkok, smile, apron.
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath();
  ctx.arc(150, 238, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.arc(150, 228, 26, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(124, 222, 52, 8);
  dot(ctx, 141, 240, 3, '#1d1d1d');
  dot(ctx, 159, 240, 3, '#1d1d1d');
  ctx.strokeStyle = '#1d1d1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(150, 250, 9, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#f1faee';
  rr(ctx, 108, 266, 84, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#e63946';
  ctx.fillRect(128, 266, 44, 44);
  // Wooden counter.
  ctx.fillStyle = '#8b5a2b';
  rr(ctx, 20, 306, 570, 96, 8);
  ctx.fill();
  ctx.fillStyle = '#6f4520';
  ctx.fillRect(20, 306, 570, 10);
  ctx.fillStyle = '#a06a35';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(40 + i * 70, 330, 4, 60);
  // Peanut sauce jar: missing on the right.
  if (!v('sauce-jar')) jar(ctx, 118, 318, '#e63946', '#c98a3d');
  jar(ctx, 210, 318, '#2a9d8f', '#7bd389');
  // Charcoal grill with skewers: four on the left, three on the right.
  ctx.fillStyle = '#1d1d1d';
  rr(ctx, 250, 330, 170, 34, 8);
  ctx.fill();
  ctx.fillStyle = '#ff6d00';
  for (let i = 0; i < 5; i += 1) dot(ctx, 268 + i * 32, 344, 7, '#ff9e00');
  const skewers = [268, 300, 332, 364];
  const shown = v('skewer') ? skewers.slice(0, 3) : skewers;
  for (const sx of shown) {
    ctx.strokeStyle = '#d9c9a3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, 330);
    ctx.lineTo(sx, 372);
    ctx.stroke();
    ctx.fillStyle = '#b5651d';
    rr(ctx, sx - 5, 336, 10, 26, 3);
    ctx.fill();
  }
  // Grill smoke: one puff missing on the right.
  ctx.fillStyle = 'rgba(220,220,220,0.55)';
  ctx.beginPath();
  ctx.arc(340, 250, 16, 0, Math.PI * 2);
  ctx.arc(366, 236, 12, 0, Math.PI * 2);
  ctx.fill();
  if (!v('smoke')) {
    ctx.beginPath();
    ctx.arc(384, 232, 13, 0, Math.PI * 2);
    ctx.fill();
  }
  // Banana leaf and cooler box on the counter.
  ctx.fillStyle = '#2a9d4a';
  ctx.beginPath();
  ctx.ellipse(470, 330, 46, 12, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#457b9d';
  rr(ctx, 520, 330, 56, 44, 6);
  ctx.fill();
  ctx.fillStyle = '#f1faee';
  ctx.fillRect(520, 344, 56, 6);
  // Floor tiles and the stall cat: missing on the right.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 402, 610, 118);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 90, 402);
    ctx.lineTo(i * 90 - 40, 520);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 452);
  ctx.lineTo(610, 452);
  ctx.stroke();
  if (!v('cat')) cat(ctx, 522, 442, '#f4a261');
  // Stool and fan at the stall's edge.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(60, 430, 60, 10);
  ctx.fillRect(66, 440, 8, 44);
  ctx.fillRect(106, 440, 8, 44);
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(560, 470, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f1faee';
  ctx.beginPath();
  ctx.arc(560, 470, 12, 0, Math.PI * 2);
  ctx.fill();
  dot(ctx, 560, 470, 4, '#e63946');
}

// ---------------------------------------------------------------------------
// Level 2 — Kuih Rainbow: Mak Timah's kuih stall.
// ---------------------------------------------------------------------------
export function drawKuihStall(ctx, variant) {
  const v = (id) => isVaried(1, id, variant);
  nightSky(ctx, '#2d1b4e', '#6d28a8', '#4a2a6e');
  // Bunting: the middle flag turns teal on the right.
  const flags = ['#ff6b6b', '#ffd166', '#4ecdc4', '#ff9f1c', '#a78bfa', '#ff6b6b', '#ffd166', '#4ecdc4'];
  for (let i = 0; i < 8; i += 1) {
    const x = 30 + i * 74;
    ctx.fillStyle = v('bunting') && i === 4 ? '#2a9d8f' : flags[i];
    ctx.beginPath();
    ctx.moveTo(x, 44);
    ctx.lineTo(x + 34, 44);
    ctx.lineTo(x + 17, 76);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#2c2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 42);
  ctx.lineTo(610, 42);
  ctx.stroke();
  // Market umbrella: one panel turns pink on the right.
  const panels = ['#ff6b6b', '#ffd166', '#4ecdc4', '#ff6b6b', '#ffd166', '#4ecdc4'];
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = v('umbrella') && i === 2 ? '#ff9ff3' : panels[i];
    ctx.beginPath();
    ctx.moveTo(424, 96);
    ctx.lineTo(330 + i * 32, 150);
    ctx.lineTo(362 + i * 32, 150);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(424, 96);
  ctx.lineTo(424, 340);
  ctx.stroke();
  // Stall sign: RM2 on the left, RM3 on the right.
  ctx.fillStyle = '#2b2118';
  rr(ctx, 40, 140, 120, 76, 8);
  ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  rr(ctx, 40, 140, 120, 76, 8);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('KUIH', 100, 170);
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(v('sign') ? 'RM3' : 'RM2', 100, 198);
  // Butterfly: only on the right panel.
  if (v('butterfly')) {
    ctx.fillStyle = '#ff9ff3';
    ctx.beginPath();
    ctx.ellipse(528, 152, 9, 13, -0.5, 0, Math.PI * 2);
    ctx.ellipse(544, 152, 9, 13, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1d1d1d';
    ctx.fillRect(535, 148, 3, 14);
  }
  // Table with a batik cloth.
  ctx.fillStyle = '#7a2e4a';
  rr(ctx, 30, 340, 550, 110, 10);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  for (let i = 0; i < 10; i += 1) dot(ctx, 60 + i * 56, 392, 9, '#ffd166');
  ctx.fillStyle = '#4a1a2e';
  ctx.fillRect(30, 340, 550, 12);
  // Kuih trays: rainbow stacks. One layer turns green on the right.
  const trayX = [110, 200, 290, 380, 470];
  const layers = ['#ff6b6b', '#ffd166', '#4ecdc4', '#a78bfa'];
  for (let t = 0; t < trayX.length; t += 1) {
    const tx = trayX[t];
    for (let l = 0; l < 4; l += 1) {
      let colour = layers[l];
      if (v('kuih-layer') && t === 1 && l === 1) colour = '#2a9d4a';
      ctx.fillStyle = colour;
      rr(ctx, tx - 34, 330 - l * 14, 68, 13, 5);
      ctx.fill();
    }
    ctx.fillStyle = '#e8e0d0';
    ctx.fillRect(tx - 40, 330, 80, 8);
  }
  // Kuih jar on the table: missing on the right.
  if (!v('kuih-jar')) jar(ctx, 478, 300, '#ff6b6b', '#ffd166');
  jar(ctx, 540, 300, '#4ecdc4', '#ff9f1c');
  // Teapot: domed lid on the left, flat lid on the right.
  ctx.fillStyle = '#457b9d';
  ctx.beginPath();
  ctx.ellipse(96, 392, 30, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  if (v('teapot')) {
    ctx.fillRect(76, 368, 40, 6);
  } else {
    ctx.beginPath();
    ctx.arc(96, 372, 14, Math.PI, 0);
    ctx.fill();
    dot(ctx, 96, 358, 5, '#ffd166');
  }
  ctx.strokeStyle = '#457b9d';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(124, 384);
  ctx.quadraticCurveTo(146, 372, 142, 356);
  ctx.stroke();
  // Teacup: blue on the left, orange on the right.
  ctx.fillStyle = v('cup') ? '#ff9f1c' : '#4ecdc4';
  rr(ctx, 366, 392, 36, 22, 6);
  ctx.fill();
  ctx.strokeStyle = v('cup') ? '#ff9f1c' : '#4ecdc4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(404, 402, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Flower pot: missing on the right.
  if (!v('flower')) {
    ctx.fillStyle = '#e07a5f';
    ctx.beginPath();
    ctx.moveTo(536, 380);
    ctx.lineTo(568, 380);
    ctx.lineTo(562, 408);
    ctx.lineTo(542, 408);
    ctx.closePath();
    ctx.fill();
    dot(ctx, 552, 366, 9, '#ff6b9d');
    dot(ctx, 542, 372, 7, '#ffd166');
    dot(ctx, 562, 372, 7, '#ff9f1c');
  }
  // Basket under the table: missing on the right.
  if (!v('basket')) {
    ctx.fillStyle = '#b5651d';
    ctx.beginPath();
    ctx.moveTo(222, 436);
    ctx.lineTo(282, 436);
    ctx.lineTo(272, 468);
    ctx.lineTo(232, 468);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7a4a21';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(252, 436, 22, Math.PI, 0);
    ctx.stroke();
  }
  // Floor with scattered petals.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 450, 610, 70);
  dot(ctx, 80, 480, 5, '#ff6b9d');
  dot(ctx, 320, 495, 5, '#ffd166');
  dot(ctx, 480, 478, 5, '#4ecdc4');
  dot(ctx, 180, 500, 5, '#a78bfa');
}

// ---------------------------------------------------------------------------
// Level 3 — Lantern Garden: a kampung house, a well and a bicycle.
// ---------------------------------------------------------------------------
export function drawLanternGarden(ctx, variant) {
  const v = (id) => isVaried(2, id, variant);
  nightSky(ctx, '#0f1f3d', '#274b73', '#1d3a5e');
  // Bright star: missing on the right.
  if (!v('star')) sparkle(ctx, 428, 48, 9, '#fff8d6');
  sparkle(ctx, 480, 90, 5, '#fff8d6');
  // Row of hanging lanterns: one turns blue on the right.
  for (let i = 0; i < 5; i += 1) {
    const x = 205 + i * 60;
    const colour = v('lantern-row') && i === 2 ? '#4ecdc4' : ['#ff6b6b', '#ffd166', '#ff6b6b', '#ffd166', '#ff6b6b'][i];
    lantern(ctx, x, 96, colour, '#ffd166');
  }
  // Kampung house: window glows yellow on the left, blue on the right.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(80, 120, 140, 170);
  ctx.fillStyle = '#a93226';
  ctx.beginPath();
  ctx.moveTo(60, 122);
  ctx.lineTo(150, 62);
  ctx.lineTo(240, 122);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6f4520';
  for (let i = 0; i < 4; i += 1) ctx.fillRect(84 + i * 34, 128, 4, 154);
  ctx.fillStyle = v('house-window') ? '#7bb8ff' : '#ffd166';
  ctx.fillRect(118, 138, 30, 30);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.strokeRect(118, 138, 30, 30);
  ctx.beginPath();
  ctx.moveTo(133, 138);
  ctx.lineTo(133, 168);
  ctx.moveTo(118, 153);
  ctx.lineTo(148, 153);
  ctx.stroke();
  // Door: arched on the left, square on the right.
  ctx.fillStyle = '#4a2c14';
  if (v('door')) {
    ctx.fillRect(128, 220, 40, 70);
  } else {
    ctx.beginPath();
    ctx.moveTo(128, 290);
    ctx.lineTo(128, 240);
    ctx.arc(148, 240, 20, Math.PI, 0);
    ctx.lineTo(168, 290);
    ctx.closePath();
    ctx.fill();
  }
  dot(ctx, 162, 258, 3, '#ffd166');
  // Tree with fruit: three on the left, two on the right.
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(508, 150, 18, 130);
  ctx.fillStyle = '#2a7a3d';
  ctx.beginPath();
  ctx.arc(480, 110, 42, 0, Math.PI * 2);
  ctx.arc(540, 100, 40, 0, Math.PI * 2);
  ctx.arc(517, 70, 38, 0, Math.PI * 2);
  ctx.fill();
  dot(ctx, 500, 120, 8, '#ff6b6b');
  dot(ctx, 540, 118, 8, '#ff6b6b');
  if (!v('tree-fruit')) dot(ctx, 520, 88, 8, '#ff6b6b');
  // Fence across the middle: one plank missing on the right.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(0, 276, 610, 8);
  ctx.fillRect(0, 296, 610, 8);
  for (let i = 0; i < 9; i += 1) {
    if (v('fence') && i === 8) continue;
    ctx.fillRect(20 + i * 66, 262, 14, 58);
  }
  // Cat sitting on the fence: missing on the right.
  if (!v('cat-fence')) cat(ctx, 300, 268, '#2b2b2b');
  // Firefly: only on the right panel.
  if (v('firefly')) {
    dot(ctx, 368, 200, 6, '#d8ff6b');
    dot(ctx, 368, 200, 12, 'rgba(216,255,107,0.3)');
  }
  // Old well: roof turns teal on the right.
  ctx.fillStyle = v('well-roof') ? '#2a9d8f' : '#a93226';
  ctx.beginPath();
  ctx.moveTo(56, 330);
  ctx.lineTo(96, 300);
  ctx.lineTo(136, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(62, 330, 8, 66);
  ctx.fillRect(122, 330, 8, 66);
  ctx.fillStyle = '#7a7a7a';
  ctx.beginPath();
  ctx.ellipse(96, 392, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5a5a5a';
  ctx.beginPath();
  ctx.ellipse(96, 390, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Well bucket: missing on the right.
  if (!v('bucket')) {
    ctx.fillStyle = '#b5651d';
    rr(ctx, 132, 408, 28, 22, 4);
    ctx.fill();
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(146, 408);
    ctx.lineTo(146, 392);
    ctx.stroke();
  }
  // Bicycle: its bell is missing on the right.
  ctx.strokeStyle = '#d9d9d9';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(420, 436, 22, 0, Math.PI * 2);
  ctx.arc(488, 436, 22, 0, Math.PI * 2);
  ctx.moveTo(420, 436);
  ctx.lineTo(452, 400);
  ctx.lineTo(488, 436);
  ctx.moveTo(452, 400);
  ctx.lineTo(470, 400);
  ctx.moveTo(452, 400);
  ctx.lineTo(436, 436);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(470, 400);
  ctx.lineTo(486, 388);
  ctx.moveTo(440, 400);
  ctx.lineTo(424, 388);
  ctx.stroke();
  if (!v('bicycle')) dot(ctx, 486, 384, 6, '#ffd166');
  // Flower bed: five blooms on the left, four on the right.
  ctx.fillStyle = '#1d3a24';
  ctx.fillRect(180, 440, 160, 40);
  const blooms = [[200, 458, '#ff6b9d'], [228, 452, '#ffd166'], [256, 460, '#ff9f1c'], [284, 452, '#a78bfa'], [312, 458, '#4ecdc4']];
  const shownBlooms = v('flower-bed') ? blooms.slice(0, 4) : blooms;
  for (const [bx, by, colour] of shownBlooms) {
    ctx.strokeStyle = '#2a7a3d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by + 6);
    ctx.lineTo(bx, by + 18);
    ctx.stroke();
    dot(ctx, bx, by, 7, colour);
  }
  // Grass at the bottom.
  ctx.fillStyle = '#14301c';
  ctx.fillRect(0, 480, 610, 40);
  ctx.strokeStyle = '#2a7a3d';
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i += 1) {
    const gx = 12 + i * 30;
    ctx.beginPath();
    ctx.moveTo(gx, 520);
    ctx.lineTo(gx + 4, 500);
    ctx.stroke();
  }
}

/** The scene painters, in level order. */
export const SCENE_PAINTERS = [drawSatayStall, drawKuihStall, drawLanternGarden];

/** Paint one panel of a level: variant 0 is the original, 1 is the changed copy. */
export function drawScene(ctx, levelIndex, variant) {
  SCENE_PAINTERS[levelIndex](ctx, variant);
}
