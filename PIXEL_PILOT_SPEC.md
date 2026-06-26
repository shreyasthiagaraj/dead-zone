# NECROWAVE — Pixel-Art Pilot (MVP Spec)

## Implementation status (2026-06-26, branch `pixel-art`)
**Harness: BUILT and verified end-to-end.** What's done:
- `index.html`: `window.PIXEL_MODE` flag (boots from `?pixel=1`), `loadEnemySprites()` loader for the 6 `sprites/enemy_*.png` with `onerror`→procedural fallback, and the flag-gated sprite branch at the body-draw chokepoint (sprite blit + neon halo + status-tint + hit-flash via `source-atop`).
- `server.js`: fixed a pre-existing static-router bug — it didn't strip the query string, so `/?pixel=1` 404'd (which broke the pilot's reload-to-toggle). Also added `.png`/image MIME types.
- `sprites/`: **placeholder** PNGs (geometric, spec-compliant: dark body + neon signature rim, facing right, transparent) so the plumbing could be verified. **These are NOT the real art** — replace with PixelLab output (step 2 below).
- **Verified in live arcade combat:** `PIXEL_MODE=true` → 173–184 sprite blits/sec across 5 enemies; `PIXEL_MODE=false` → 0 blits, procedural fallback pristine; no console errors; `?pixel=1` boots all 6 sprites `ready`.

**Still TODO:** (1) generate the 6 real sprites in PixelLab (the MCP server `pixellab` is added but its tools need a Claude Code restart to load), drop them into `sprites/` over the placeholders. (2) The subjective A/B quality call — is pixel *better*? — against the real art, in combat with VFX firing.

## Goal & hypothesis
Answer ONE question cheaply, before committing to a 700–2000 asset conversion:

> **Do AI-generated pixel sprites, dropped into the *real* lit + VFX-heavy scene and rotated by `ctx.rotate`, look BETTER than the current procedural shapes — or do they look pasted-on and shimmer-y?**

We test this with **6 sprites, static (no walk cycles), behind a feature flag**, blitted through the existing render transform. Everything else (lighting, fog, particles, VFX, telegraphs, status tints) stays untouched. If the look wins in combat with VFX on, we scale up. If it looks pasted-on, we spent ~1 day instead of ~3 months.

**Non-goals for the MVP:** directional sprite sets, animation frames, environment/prop/card art, PWA/iOS bundling, performance tuning. All deferred until the look is validated.

---

## The 6 sprites
High-frequency, visually representative, spans the size + behavior range. Native colors preserved so they read identically to today.

| # | type | radius | on-screen Ø @0.9 zoom | why it's in the set | sprite px |
|---|------|--------|----------------------|---------------------|-----------|
| 1 | `normal` | 28 | ~50px | baseline shambler, most common enemy | 64×64 |
| 2 | `fast`   | 28 | ~50px | charger — tests **rotation readability** (directional silhouette) | 64×64 |
| 3 | `tank`   | 53 | ~95px | big body — tests large-sprite scale & crispness | 96×96 |
| 4 | `spitter`| 28 | ~50px | ranged — tests a non-melee silhouette | 64×64 |
| 5 | `brute`  | 41 | ~74px | mid-heavy, in the early pool | 80×80 |
| 6 | `boss` (THE WARDEN) | 69 | ~124px | **the central test**: pixel body UNDER the existing neon wireframe-ring/tesseract VFX — proves "chunky sprite + smooth glow" coexist | 160×160 |

Author every sprite at **2× the px above** (e.g. 128×128 for `normal`) for retina, then let canvas downscale.

> Boss note: keep the Warden's existing ring/cube/glitch VFX overlay ([index.html:38377](index.html:38377)) drawing ON TOP of the sprite. That layering IS the experiment.

---

## Style bible (give this verbatim to pixelab.ai)

**Concept:** "Corrupted digital entities" — not flesh zombies. Glitchy data-creatures inside a hostile computer system. This is *on-theme* for NECROWAVE; lean into it.

**Hard constraints (every sprite must obey):**
- **Pure top-down / bird's-eye view.** NOT 3/4, NOT side. A top-down creature looks natural when rotated; a 3/4 view shimmers and "tips over" when `ctx.rotate` spins it. This is the single most important rule.
- **Facing RIGHT (east, 0°).** The procedural shapes are authored "forward = +x". Sprite's nose/front/barrel must point right so rotation lines up. (e.g. `fast` is a triangle pointing right; `spitter` a diamond; `tank` a square.)
- **Transparent background** (PNG alpha). No baked floor, no drop shadow baked in.
- **Dark body + neon edge-light.** Body interior dark (#1a1a1a–#222, matching the current solid fill), with a bright neon rim in the enemy's signature color. This matches the existing neon-outline language and keeps them readable on the dark lit floor.
- **Resolution:** crisp pixel art, ~1–2px outline, limited palette (≤16 colors per sprite). No anti-aliasing on the silhouette edge (we want clean rotation).
- **Centered** in the canvas, body roughly filling 85% of frame (the radius maps to half the sprite width).

**Per-enemy signature color (preserve exactly — these drive the status-tint system):**
| type | color | shape language |
|------|-------|----------------|
| normal | `#2f8` green | rounded blob / hunched mass |
| fast | `#ff0` yellow | sharp wedge/arrow pointing right |
| tank | `#0fa` cyan | heavy armored square block |
| spitter | `#a4f` magenta | diamond with a bile-spout maw |
| brute | `#f60` orange | bulky hexagonal brawler |
| boss (Warden) | `#f0f` magenta | notched square "admin process", ominous |

**Glitch treatment:** subtle datamosh/scanline accents, 1–2 displaced pixel chunks, chromatic-fringe pixels on the rim. Don't overdo it — the engine adds live scanlines/glitch on top.

**Domain palettes (for later, not needed for the 6 MVP sprites):** D1 magenta `#b06`, D2 orange `#f60`, D3 cyan `#4ef`, D4 white/gold `#fff`/`#ff0`.

### Per-sprite prompts (starting points — iterate)
> Prefix all with: *"top-down bird's-eye pixel art sprite, facing right, transparent background, dark interior body with glowing neon [COLOR] rim light, limited palette, crisp 1px outline, corrupted digital monster, subtle glitch/scanline accents, centered."*

1. **normal** — "…a shambling corrupted humanoid data-blob, green `#2f8` rim, slumped rounded mass, faint glitch artifacts."
2. **fast** — "…a fast charging dart-creature, yellow `#ff0` rim, sharp arrow/wedge body pointing right, motion-streak pixels trailing left."
3. **tank** — "…a heavy armored cube-brute, cyan `#0fa` rim, thick plated square body, dense and immovable, riveted edges."
4. **spitter** — "…a ranged bile-caster, magenta `#a4f` rim, diamond body with an open spout/maw at the front-right, dripping corrupted pixels."
5. **brute** — "…a bulky hexagonal brawler, orange `#f60` rim, broad shoulders, heavy fists, aggressive stance."
6. **boss / Warden** — "…THE WARDEN, a corrupted admin process boss, magenta `#f0f` rim, ominous notched square core, geometric and authoritative, dark menacing interior with faint inner circuitry."

---

## Technical integration

### 1. Feature flag
```js
// near other globals
window.PIXEL_MODE = false;            // master toggle
// enable via console: PIXEL_MODE = true  (or ?pixel=1 URL param at boot)
```
Read `?pixel=1` at startup to flip it without editing code, so A/B testing is a page reload.

### 2. Asset loading (single-file-friendly, fail-safe)
New `sprites/` folder served statically (server.js already serves static files). Lazy-load with graceful fallback — **a missing/unloaded sprite falls back to `_drawZombieShape`, so the game never breaks.**

```js
const ENEMY_SPRITES = {};            // type -> {img, ready}
const PIXEL_SPRITE_TYPES = ['normal','fast','tank','spitter','brute','boss'];
function loadEnemySprites(){
  for (const t of PIXEL_SPRITE_TYPES){
    const img = new Image();
    const rec = { img, ready:false };
    img.onload = () => { rec.ready = true; };
    img.onerror = () => { rec.ready = false; };   // stays on procedural path
    img.src = `sprites/enemy_${t}.png`;
    ENEMY_SPRITES[t] = rec;
  }
}
// call once at boot, only if PIXEL_MODE (or always — it's cheap and non-blocking)
```
> Production note (defer): for PWA offline + iOS, the `sprites/*.png` need adding to `sw.js` precache and the Capacitor bundle. **Not required for the in-browser pilot.** Inline-base64 is the alternative if you want to keep index.html truly single-file — only worth it after the look is validated.

### 3. The swap — one branch at the chokepoint
At the body-draw block ([index.html:38554-38638](index.html:38554)), wrap the procedural body in a branch. The code is already inside `translate + rotate + scale`, so the sprite is centered at the origin and inherits all of it.

```js
const _spr = window.PIXEL_MODE && ENEMY_SPRITES[z.type];
if (_spr && _spr.ready) {
  // --- PIXEL PATH ---
  // optional single soft neon halo so it still glows with the scene
  ctx.globalAlpha = 0.18 + _zt*0.04;
  ctx.fillStyle = _zc;
  ctx.beginPath(); ctx.arc(0,0,_zr+6,0,Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // body sprite — drawn so radius _zr maps to half-width
  ctx.imageSmoothingEnabled = false;             // crisp pixels
  ctx.drawImage(_spr.img, -_zr, -_zr, _zr*2, _zr*2);

  // status tint (frozen/shocked/exposed/etc.) — mask to sprite alpha
  if (_zc !== z.color) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.4; ctx.fillStyle = _zc;
    ctx.fillRect(-_zr,-_zr,_zr*2,_zr*2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // hit flash — white pop, masked to sprite alpha
  if (z._hfPulse > 0) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.92; ctx.fillStyle = '#fff';
    ctx.fillRect(-_zr,-_zr,_zr*2,_zr*2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
} else {
  // --- EXISTING PROCEDURAL PATH (unchanged) ---
  // ...the current lines 38560-38638...
}
```
**What you get for free (no extra code):**
- Facing/rotation (outer `ctx.rotate(z.angle)`)
- Spawn-in scale, telegraph squash/wobble, hit-recoil offset (outer `ctx.scale`/translate)
- Fog + flashlight darkening (full-screen lighting composite runs after, at [index.html:40711](index.html:40711))
- Telegraph rings, beam/laser sights, shielder arc, ALL particles/VFX (drawn outside this block)
- Boss wireframe-ring/tesseract overlay (the boss VFX at [index.html:38377](index.html:38377) layers on top of the sprite — the key coexistence test)

**Deliberately dropped on the pixel path (fine for MVP):** the 3-pass fake-glow halos, procedural scanline clip, tier inner-fill — the sprite art carries its own form and glitch.

### 4. Caller sites to leave alone
`_drawZombieShape` is also used for the shop/telegraph preview ([index.html:14872](index.html:14872)) and minimap ([index.html:40964](index.html:40964)). **Leave those procedural** — the MVP only swaps the in-world body. Don't gate them on PIXEL_MODE.

---

## Asset pipeline
```
sprites/
  enemy_normal.png    (128×128, transparent)
  enemy_fast.png      (128×128)
  enemy_tank.png      (192×192)
  enemy_spitter.png   (128×128)
  enemy_brute.png     (160×160)
  enemy_boss.png      (320×320)
```
Naming: `enemy_<type>.png`. Drop a new PNG, reload page → instant iteration. Fallback keeps the game playable even with zero sprites present.

---

## Verification / success criteria
1. `npm start`, open with `?pixel=1` vs without — **side-by-side screenshots** of the same section.
2. Test **in combat with 8+ enemies and VFX firing** (not a static pose) — does it read, or does it shimmer/clash?
3. Toggle a status (freeze/shock) and trigger hit-flash — confirm tint + flash still land on the sprite.
4. Fight the Warden — does the pixel body + neon ring VFX look intentional or muddy?
5. Mobile viewport (`preview_resize`) — still readable at thumb scale?
6. Syntax check: `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"`

**Ship-the-conversion bar:** in combat, ≥3 of the 6 sprites look clearly *better* than procedural AND rotation shimmer is not distracting. If only the boss wins, that tells you to do *bosses + props* in pixel art and keep regular enemies procedural — also a valid outcome.

---

## What this de-risks for ~1 day of work
- Real rotation behavior on real silhouettes (the #1 unknown)
- Pixel body vs. smooth neon VFX coexistence (the #2 unknown)
- Lighting interaction (now known to be free — confirm visually)
- AI tool consistency across a small set before betting on 1000+
