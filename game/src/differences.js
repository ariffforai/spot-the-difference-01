// The difference catalogue for Pasar Malam: Spot the Difference.
//
// Every level lists its differences as data: an id, a scene-space position
// (x, y in a 610 x 520 panel), a hit radius, a short label for the checklist
// and a kind that tells the scene painter what changes on the right panel.
// The scene painter in scenes.js reads this list; the hit tester in input.js
// reads it too, so the pictures and the answers can never drift apart.
export const PANEL_WIDTH = 610;
export const PANEL_HEIGHT = 520;

/**
 * One hidden change. `kind` values:
 *  colour  - the same object, painted a different colour on the right
 *  missing - an object the right panel simply does not draw
 *  added   - an object only the right panel draws
 *  count   - the right panel draws one fewer (or one more) of a repeated item
 *  text    - a sign or label reads differently on the right
 *  shape   - the same object, drawn a different shape on the right
 */
export const LEVELS = [
  {
    name: 'Satay Smoke',
    stall: 'Pakcik Rahim\u2019s Satay Stall',
    timeLimit: 180,
    blurb: 'Charcoal smoke, peanut sauce and a cat that guards the grill.',
    differences: [
      { id: 'moon', x: 528, y: 52, r: 26, label: 'Moon colour', kind: 'colour' },
      { id: 'lantern', x: 88, y: 118, r: 26, label: 'Lantern colour', kind: 'colour' },
      { id: 'awning', x: 196, y: 66, r: 24, label: 'Awning stripe', kind: 'colour' },
      { id: 'skewer', x: 306, y: 348, r: 26, label: 'Skewer count', kind: 'count' },
      { id: 'cat', x: 522, y: 442, r: 30, label: 'Stall cat', kind: 'missing' },
      { id: 'sauce-jar', x: 118, y: 318, r: 26, label: 'Sauce jar', kind: 'missing' },
      { id: 'price', x: 452, y: 196, r: 26, label: 'Menu price', kind: 'text' },
      { id: 'smoke', x: 384, y: 232, r: 26, label: 'Grill smoke', kind: 'missing' },
    ],
  },
  {
    name: 'Kuih Rainbow',
    stall: 'Mak Timah\u2019s Kuih Stall',
    timeLimit: 180,
    blurb: 'Ten trays of kuih, one teapot, and a butterfly that cannot sit still.',
    differences: [
      { id: 'bunting', x: 305, y: 54, r: 22, label: 'Bunting flag', kind: 'colour' },
      { id: 'kuih-layer', x: 168, y: 296, r: 26, label: 'Kuih layer', kind: 'colour' },
      { id: 'kuih-jar', x: 478, y: 300, r: 26, label: 'Kuih jar', kind: 'missing' },
      { id: 'teapot', x: 96, y: 386, r: 26, label: 'Teapot lid', kind: 'shape' },
      { id: 'flower', x: 552, y: 380, r: 24, label: 'Flower pot', kind: 'missing' },
      { id: 'umbrella', x: 424, y: 96, r: 26, label: 'Umbrella panel', kind: 'colour' },
      { id: 'basket', x: 252, y: 436, r: 28, label: 'Basket', kind: 'missing' },
      { id: 'sign', x: 96, y: 176, r: 26, label: 'Stall sign', kind: 'text' },
      { id: 'cup', x: 384, y: 402, r: 22, label: 'Teacup colour', kind: 'colour' },
      { id: 'butterfly', x: 536, y: 158, r: 24, label: 'Butterfly', kind: 'added' },
    ],
  },
  {
    name: 'Lantern Garden',
    stall: 'Kampung Lantern Garden',
    timeLimit: 210,
    blurb: 'Twelve lanterns, one bicycle, and a well that keeps its own secrets.',
    differences: [
      { id: 'house-window', x: 148, y: 150, r: 24, label: 'House window', kind: 'colour' },
      { id: 'lantern-row', x: 305, y: 96, r: 24, label: 'Hanging lantern', kind: 'colour' },
      { id: 'bicycle', x: 452, y: 428, r: 28, label: 'Bicycle bell', kind: 'missing' },
      { id: 'well-roof', x: 96, y: 330, r: 26, label: 'Well roof', kind: 'colour' },
      { id: 'flower-bed', x: 232, y: 452, r: 24, label: 'Garden flower', kind: 'count' },
      { id: 'fence', x: 552, y: 300, r: 24, label: 'Fence plank', kind: 'missing' },
      { id: 'tree-fruit', x: 520, y: 120, r: 24, label: 'Tree fruit', kind: 'count' },
      { id: 'firefly', x: 368, y: 200, r: 22, label: 'Firefly', kind: 'added' },
      { id: 'cat-fence', x: 300, y: 268, r: 26, label: 'Cat on fence', kind: 'missing' },
      { id: 'bucket', x: 148, y: 420, r: 24, label: 'Well bucket', kind: 'missing' },
      { id: 'door', x: 148, y: 250, r: 26, label: 'House door', kind: 'shape' },
      { id: 'star', x: 428, y: 48, r: 22, label: 'Bright star', kind: 'missing' },
    ],
  },
];

/** Total hidden changes across the whole game (8 + 10 + 12). */
export const TOTAL_DIFFERENCES = LEVELS.reduce((sum, level) => sum + level.differences.length, 0);

/** True when the right panel (variant 1) changes this difference. */
export function isVaried(levelIndex, diffId, variant) {
  if (variant !== 1) return false;
  return LEVELS[levelIndex].differences.some((d) => d.id === diffId);
}

/** Find a difference by id inside a level. */
export function differenceById(levelIndex, diffId) {
  return LEVELS[levelIndex].differences.find((d) => d.id === diffId) ?? null;
}
