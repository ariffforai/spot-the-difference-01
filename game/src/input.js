// Pointer and keyboard input: translate a click on the canvas into a scene
// position, test it against the unfound differences, and recognise the HUD
// buttons drawn by hud.js.
//
// The canvas is drawn at a fixed logical size (1280 x 800) and scaled by CSS
// to fit the window, so every pointer position is scaled back into logical
// coordinates before anything else happens.
import { PANEL_WIDTH, PANEL_HEIGHT } from './differences.js';
import { remainingDifferences } from './state.js';

export const LOGICAL_WIDTH = 1280;
export const LOGICAL_HEIGHT = 800;
export const PANEL_TOP = 92;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 650;
export const PANEL_GAP = 20;

/** Convert a pointer event into logical canvas coordinates. */
export function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = LOGICAL_WIDTH / rect.width;
  const scaleY = LOGICAL_HEIGHT / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

/**
 * Which panel (0 = left, 1 = right) a logical point falls in, and its scene
 * coordinates — or null when the point is outside both pictures.
 */
export function pointToScene(point) {
  if (point.y < PANEL_TOP || point.y > PANEL_TOP + PANEL_HEIGHT) return null;
  if (point.x >= PANEL_LEFT_X && point.x <= PANEL_LEFT_X + PANEL_WIDTH) {
    return { panel: 0, x: point.x - PANEL_LEFT_X, y: point.y - PANEL_TOP };
  }
  if (point.x >= PANEL_RIGHT_X && point.x <= PANEL_RIGHT_X + PANEL_WIDTH) {
    return { panel: 1, x: point.x - PANEL_RIGHT_X, y: point.y - PANEL_TOP };
  }
  return null;
}

/**
 * The unfound difference nearest a scene point, when the click lands inside
 * its hit circle — checked on both panels, since a difference counts wherever
 * the player spots it.
 */
export function hitTestDifference(state, scene) {
  const left = remainingDifferences(state);
  for (const diff of left) {
    const dx = scene.x - diff.x;
    const dy = scene.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

/** True when a logical point falls inside a rectangle. */
export function insideRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.w
    && point.y >= rect.y && point.y <= rect.y + rect.h;
}
