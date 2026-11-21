# Pasar Malam: Spot the Difference

[![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ariffforai/spot-the-difference-01/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ariffforai/spot-the-difference-01/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

Hunt 30 hidden changes across 3 night-market scenes — a Malaysian pasar malam drawn entirely in code, no assets, no network.

**[Enter the bounty on make.fun](https://make.fun/c/best-spot-the-difference-game-20261121-0451)**

## What it is

Two near-identical pictures side by side. Click the difference — it gets circled on **both** panels, the FOUND counter ticks up, and a chime plays. Find them all before the timer runs out.

- **3 stalls, 30 differences** — Satay Smoke (8), Kuih Rainbow (10), Lantern Garden (12), each denser and trickier than the last.
- **One core verb** — click the difference. Fair but hidden: colour swaps, missing objects, changed counts, altered signs, added fireflies and butterflies.
- **Time pressure you can feel** — a countdown bar, −5 seconds for every wrong click, and a screen shake on a miss.
- **Hints that behave** — H (or the HINT button) rings one unfound difference on both panels, costs 50 points, 3 per stall.
- **Win / lose / restart** — clear a stall for up to 3 stars, clear all three to become Pasar Malam Champion; run out of time and the stall closes.
- **Offline** — plain static files, no libraries, no network requests. All art is procedural 2D canvas; all sound is synthesised WebAudio.

## Try it

Serve `game/` with any static file server and open `index.html`:

```sh
node serve.ts
# open http://localhost:8080
```

Controls: click a difference · `H` = hint · `R` = restart stall · `1 / 2 / 3` = stall · `M` = sound · `Enter` = continue after a clear.

Add `?shot=cover|play|level|win` to stage a screenshot frame — the same frozen mid-hunt states the screenshots in `screenshots/` were taken from.

## How it is built

- `game/src/scenes.js` — the three night-market scenes, drawn in code; one painter draws both panels, the differences list toggling the variations.
- `game/src/differences.js` — the catalogue: 30 differences with positions, hit radii, labels and kinds (colour, missing, added, count, text, shape).
- `game/src/state.js` — levels, timer, score, hints, win/lose flow and particles.
- `game/src/render.js` — the frame: both panels, found markers, hint rings, particles and overlays.
- `game/src/hud.js` — the top bar (FOUND counter, timer, score, buttons) and the bottom checklist bar.
- `game/src/input.js` — pointer-to-scene mapping and hit testing.
- `game/src/audio.js` — synthesised WebAudio effects, no audio files.
- `game/src/shots.js` — the staged screenshot states behind `?shot=`.
- `game/src/main.js` — boot, game loop and input wiring.
- `main.ts` — the entry point: copies `game/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. It only creates the output directory and copies files into it.
- `vendor/makefun-game.ts` — the make.fun dossier library, as shipped in the bounty kit.

Everything in this entry is original: the scenes, names, art and sounds were made for this bounty. No commercial game is copied.

## License

MIT — see [LICENSE](LICENSE).
