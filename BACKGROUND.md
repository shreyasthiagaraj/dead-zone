# NECROWAVE — Background & Knowledge Dump

This document captures everything a future Claude Code session needs to understand the game, its history, what works, what doesn't, and where it's headed. Read this alongside `CLAUDE.md` (technical architecture) and `IDEAS.md` (future plans).

---

## What Is This Game?

**NECROWAVE** (necro + synthwave — zombies meet 80s neon) is a top-down zombie survival shooter built as a single HTML file. It runs in any browser, supports up to 4 players via WebSocket multiplayer, and has full mobile touch controls. The vibe is dark, gory, frantic arcade action — pick up and play, no install, no tutorial. Think Vampire Survivors meets Hotline Miami meets Left 4 Dead, but in a browser.

The entire game lives in `index.html` (~5000+ lines of JS in a single `<script>` tag). The server (`server.js`) is a stateless WebSocket relay that handles lobbies and message passing — zero game logic on the server.

---

## The Vibe

- **Dark and atmospheric** — fog of war, flashlight beams, zombie eyes glowing through darkness
- **Gory and violent** — directional blood bursts, gore chunks with gravity, blood pools, splatter trails
- **Frantic and fast** — enemies come in waves, the gun gets stronger as you kill, streaks reward aggression
- **Arcade-style progression** — no inventory management, no complex menus. Kill zombies, get stronger, survive longer
- **Multiplayer-first** — the game is primarily played with friends. Solo is fun but co-op is the main event
- **Horror undertones** — dark corridors, ambient drips, zombie groans through fog, sudden sprinter charges

The game should never feel slow or strategic. It should feel like controlled chaos.

---

## Evolution of the Game Design

### Phase 1: Traditional Shooter (early commits)
Started as a dungeon crawler with multiple weapons (pistol, shotgun, SMG, rifle, Tesla, etc.), ammo management, and room-by-room progression. Players found weapons on the ground and managed a 3-weapon inventory.

**What worked:** Core feel was good — movement, shooting, fog of war, flashlight all felt right from early on.

**What didn't work:** Weapon variety created balance problems. Some guns were clearly better. Ammo management was tedious, not fun. Players spent more time managing inventory than shooting.

### Phase 2: Perks & Synergies (middle commits)
Added a perk system (vampire, second wind, etc.) with synergy combos between perks. Tried to add depth through build variety.

**What worked:** Vampire (heal on kill) and Second Wind (revive once) felt good.

**What didn't work:** Perk system was too complex for the arcade vibe. Players didn't want to read perk descriptions mid-combat. Synergies were invisible — you couldn't tell when they were active. The game was trying to be a roguelite without the meta-progression to support it.

### Phase 3: Arcade Escalation System (current — `experimental` branch)
Complete redesign. Stripped out multiple weapons and complex perks. Replaced with:

- **One gun that scales smoothly** — damage, fire rate, and bullet size grow with kills. No tiers, no transitions, just a gun that gradually becomes a monster. Color shifts yellow → orange → red. Caps at 150 kills (+80% damage, +35% fire rate, +30% bullet size).
- **Kill streaks** — 5 kills = health drop, 10 = power-up, 15 = power-up, 20 = orbital companion. Encourages aggression.
- **Element zones** — fire/ice/lightning floor zones that imbue your bullets for 12 seconds. Each element has distinct effects (see below).
- **Orbital companions** — flame ring, lightning drone, ice shield, shadow clone. 20-second duration, dropped at 20-kill streaks.
- **Shockwave blast** — replaced the dash. 250px radius explosion that inherits your active element. Brief invincibility. Detonates barrels.
- **Power-ups** — Rage (damage boost), Shield (150HP force field that deflects projectiles), Triple Shot (3 bullets at 50% each), Sunbeam (flashlight damages zombies), Nuke (kills everything).

**What works:** This system feels right. The smooth gun scaling creates a natural difficulty curve. Kill streaks make you *want* to be aggressive. Elements add variety without complexity — you walk into a zone, your bullets change, simple. The shockwave blast is satisfying and tactical.

**What doesn't work yet:** Balance is ongoing. Lightning chains were too powerful (nerfed from 70% to 20% damage with shorter range). Sunbeam range was too far (nerfed from 400 to 250px). Shield needed to be breakable (added 150 HP pool) and needed to deflect projectiles (added).

---

## Element System — What Each Does

**Fire** — DoT damage. Burns spread between nearby zombies. Lights up the area (visual glow). Best for crowd control and area denial. Shockwave blast = fire explosion.

**Ice** — Movement control. Slows zombies, freezes them solid at 3 stacks (can't move or attack for 2.5s). Ice crystals appear as fixed diamond shapes at impact. Shockwave blast = ice burst.

**Lightning** — Brief stun. 0.75 seconds of full paralysis (can't move or attack), then back to normal. Chains between nearby enemies at 20% of bullet damage with 120-150px range. Shockwave blast = chain arcs between enemies + radiating bolts. Lightning was reworked several times — originally it was too similar to ice (both slowed). Making it a brief full stun gave it a distinct identity: ice = sustained slow, lightning = brief lockdown.

---

## Zombie Types & What We Learned

| Type | HP | Behavior | Notes |
|------|-----|----------|-------|
| Shambler | 180 | Walks toward player | Bread and butter. Gets enraged (faster, red) when nearby zombie dies |
| Sprinter | 110 | Charge attack: wind up → dash → rest | Scary in groups. The charge creates tension. |
| Bruiser | 500 | Walk → windup(shake) → leap → ground pound | Originally just a slow walker — boring. Leap attack made it a real threat. Ground pound does 30 dmg in 100px radius. |
| Spitter | 140 | Keeps distance, fires 3-spread projectile | Backpedals when you get close. Creates zoning pressure. |
| Bomber | 100 | Throws arcing bombs, explodes on death | Explosion radius forces movement. |
| Shielder | 200 | Front shield blocks bullets, must be flanked | Shield faces player. Forces positioning. |
| Sniper | 90 | Stays far, charges laser line (dashed), fires fast shot | Laser telegraph gives you time to dodge. Retreats when you approach. |
| Boss | 700 | Retreats, summons 2 shamblers every few seconds | Summoner archetype. You have to rush it or get overwhelmed. |

**Key lesson:** Every zombie needs a distinct silhouette AND a distinct behavior. Slow damage sponges are boring. The Bruiser was terrible until it got the leap attack. The Sniper was boring until it got the visible laser telegraph. Each zombie should force you to change your behavior.

---

## Game Modes

### Dungeon (original mode, `main` branch focus)
Procedurally generated maze of rooms connected by L-shaped corridors. Find the exit, go deeper. Seeded RNG for multiplayer determinism.

### Survival
Open circular arena, wave-based. Countdown between waves. Smaller map than dungeon. Wave summary screen between rounds.

### Horde (recently overhauled)
Circular arena with a **defend circle** at the center. Two loss conditions: die, or let zombies claim the circle. 40% of zombies are "invaders" that path toward the circle instead of the player (switch to player if threatened). If zombies stay in the circle for 15 seconds, it's claimed — game over. Circle color shifts cyan → yellow → red as claim progresses. Items spawn in a ring around the arena (not center, to avoid stacking). Continuous spawning with escalating difficulty.

### Gauntlet
Sequence of rectangular rooms. Clear each room to advance. Boss rooms every 5 rooms. Room names and flavor text for atmosphere.

### The Descent
Vertical scrolling — tall grid divided into sections. Clear enemies in a section, gate opens, descend. Upper wall closes behind you. This was the hardest mode to implement due to the dynamic arena height (see "Hard Lessons" below).

---

## Hard Lessons Learned

### 1. Arena dimensions must be mutable
`ARENA_W` and `ARENA_H` were originally `const`. The Descent needed a 16960px tall arena instead of the default 3600px. This broke EVERYTHING — WebGL grid texture, obstacle collision, line-of-sight, bullet bounds, player clamping, zombie clamping, floor rendering. The fix was `setArenaDimensions(w, h)` that updates all dependent values. ~15 scattered ternary hacks had to be removed. **Never hardcode arena dimensions.**

### 2. WebGL textures must be power-of-two on mobile
The dungeon grid texture was 90x424 for The Descent. Mobile GPUs silently failed — no error, just black screen. Fixed by padding to next power-of-two (128x512). The `uploadDungeonGrid()` function now handles this.

### 3. Visual effects inside `if(isHost)` blocks are host-only
This was the #1 source of multiplayer bugs. Any particle, floating text, or screen shake created inside host-only code paths won't appear on non-host clients. Effects need to either live in shared code paths or be replicated in `applyHostState`.

### 4. Elemental damage couldn't kill
Burn/freeze/lightning DoT brought zombies to 0 HP but nothing processed the death because the damage happened outside the normal bullet collision loop. Had to add a "death sweep" at the end of the zombie AI loop that checks for 0 HP zombies.

### 5. Player bullets should NOT be synced
Early versions tried to sync all bullets over WebSocket. This was laggy and wasteful. Solution: each client renders its own bullets locally based on firing state. Only zombie projectiles (spitters) are synced. Visually identical, much less bandwidth.

### 6. Shield balance is tricky
Shield went through several iterations:
- v1: Full invincibility → too powerful, no interaction
- v2: Absorbs damage, breakable at 150 HP → better, but projectiles passing through looked wrong
- v3: Force field that pushes zombies + deflects projectiles + breaks at 150 HP → feels right

### 7. Slow zombie damage sponges are boring
The Bruiser was originally just a high-HP slow walker. Players kited it trivially. Adding the leap attack (windup shake → airborne → ground pound) made it a genuine threat that forces reaction.

---

## Branches

- **`main`** — Old weapon-based system. Stable but outdated. Has dungeon, survival, horde, gauntlet modes.
- **`experimental`** — Current active branch. Arcade escalation system, element zones, orbitals, The Descent, all recent balance changes. This is the future of the game.

The branches have diverged significantly. The experimental branch is the one to develop on.

---

## Technical Gotchas

- **Single file** — all game logic is in one `<script>` tag. Search by function name. The file is 5000+ lines.
- **Syntax check** — `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` — validates JS without running the game. Run this after every change.
- **No build step** — `npm start` serves files. Open browser. That's it.
- **Mobile detection** — user agent sniffing sets `mobile`/`desktop` CSS class. Touch controls (dual joysticks) activate on mobile. Keyboard + mouse on desktop.
- **Seeded RNG** — `seededRandom(seed)` returns a deterministic random function. Critical for multiplayer — all clients generate the same map from the same seed.
- **WebGL lighting with canvas fallback** — lighting system tries WebGL first, falls back to canvas 2D compositing. The WebGL path uses a grid texture for wall occlusion.
- **Capacitor iOS project** — `ios/` directory contains a generated Xcode project for App Store packaging. Build with `npm run build:mobile`. `MULTIPLAYER_SERVER_URL` in index.html must be set to a public server URL for the native app (can't use `location.host`).

---

## What Needs Work

### Balance (ongoing)
- Difficulty curve in horde mode — currently uses hard caps on max zombies (8) which may feel sparse
- Element balance — fire is strong (spreads), ice is solid (freeze), lightning has been nerfed hard (20% chain damage) and may need a buff to its niche
- Power-up duration and impact — some feel impactful (nuke, shield), others are forgettable

### Missing Features (see IDEAS.md for full list)
- No meta-progression between runs (the single biggest gap vs being a roguelite)
- No persistent unlocks, no currency, no upgrade screen
- No daily runs or leaderboards
- No character variety (everyone plays the same)

### Polish
- No sound design beyond procedural synth tones — no music, no ambient loops (there are combat music triggers but they're synth-generated)
- No tutorial or onboarding — you just start shooting
- Death screen could be more impactful

---

## Monetization Direction

**Free multiplayer, premium single player.** Multiplayer is the growth engine (play with friends, tell others). Single player is the deep, progression-rich experience worth $5-7. See `IDEAS.md` for the full plan.

---

## File Map

| File | Purpose |
|------|---------|
| `index.html` | The entire game — HTML + CSS + JS |
| `server.js` | WebSocket relay server + static file serving |
| `CLAUDE.md` | Technical architecture guide for Claude Code |
| `IDEAS.md` | Future features and monetization plans |
| `BACKGROUND.md` | This file — history, decisions, vibe |
| `capacitor.config.ts` | Capacitor iOS config |
| `build-mobile.sh` | Copies web assets to www/, syncs iOS |
| `ios/` | Generated Xcode project (Capacitor) |
| `sounds/` | Generated sound effect files |
| `generate-sounds.js` | Script that generates sound files |
| `Context/` | Archived Unity assets (gitignored, not used) |
