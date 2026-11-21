// Pasar Malam: Spot the Difference — the entry program (Node 22, stdlib only).
//
// It hands the game in: it copies this repository's game/ and screenshots/
// into the output directory and writes dossier.json there with the vendored
// make.fun library, so the sealed scorer can check the files and the judge
// can read the dossier.
//
// The output directory is MAKEFUN_OUTPUT_DIR outside the grader, or /output
// inside it. The program only ever creates directories and copies files into
// them — it never deletes the output directory itself, because the grader
// mounts it and removing it fails. Run it twice and the two runs must write
// byte-identical files: everything copied is a plain file, and the dossier is
// a deterministic function of those files.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

mkdirSync(outputDir, { recursive: true });
cpSync(gameDir, join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The caps match the gate: dossier text under 160 KiB, at most 4 screenshots
// of at most 256 KiB each, game/ under 993 files and 48 MiB, every game path
// under 1000 bytes. buildDossier refuses an entry that would break them.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
