# NECROWAVE — Background & Knowledge Dump

This document captures everything a future Claude Code session needs to understand the game, its history, what works, what doesn't, and where it's headed. Read this alongside `CLAUDE.md` (technical architecture + design principles) and `IDEAS.md` / `IDEAS_V2.md` (future plans).

Last refreshed: June 2026, on the `prototype` branch.

---

## What Is This Game?

**NECROWAVE** (necro + synthwave) is a top-down arcade roguelike shooter built as a single HTML file (~40,000 lines of JS in one `<script>` tag). It runs in any browser, supports up to 4 players via WebSocket multiplayer, has full mobile touch controls, ships as a PWA, and has a Capacitor iOS wrapper for App Store packaging. The server (`server.js`) is a stateless WebSocket relay that handles lobbies and message passing — zero game logic on the server.

The setting has evolved from literal zombies into **cyber-horror**: you fight corrupted digital entities through the domains of a hostile system — ENTRY CACHE (magenta) → CORRUPTED SUBNET (orange) → DEEP STORAGE (cyan) → THE CORE (white wireframe). Enemies read as hostile processes; the elemental classes read as attack vectors (thermal overload, cryo lock, electrical cascade, kinetic shear, viral payload). Think Vampire Survivors meets Hotline Miami, in a browser, wearing a glitch aesthetic.

---

## The Vibe

- **Neon glitch-horror** — scanlined enemies, chromatic aberration, glitch chars, domain-shifting palettes
- **Gory and violent** — directional burst particles, gibs, decals, splatter trails (now neon-tinted)
- **Frantic and fast** — designed wave compositions, multikill streaks, telegraphed elite attacks
- **Arcade-style progression** — no inventory management. Kill, level, draft cards, get visibly stronger
- **Mobile-first** — thumbs only, 10-20 minute sessions, auto-fire at full stick extension
- **The power fantasy is the product** — by mid-run your build should be clearing rooms that would have killed you at the start

The game should never feel slow or strategic. It should feel like controlled chaos.

---

## Evolution of the Game Design

### Phase 1: Traditional Shooter (`main` branch)
Dungeon crawler with multiple weapons (pistol, shotgun, SMG, rifle, Tesla, etc.), ammo management, 3-weapon inventory, room-by-room progression, fog of war + flashlight.

**What worked:** Core feel — movement, shooting, fog, flashlight — was right from early on.
**What didn't:** Weapon balance problems; ammo management was tedious; players managed inventory instead of shooting.

### Phase 2: Perks & Synergies
Perk system (vampire, second wind, etc.) with synergy combos.

**What worked:** Vampire and Second Wind felt good.
**What didn't:** Too complex for the arcade vibe; synergies were invisible; a roguelite without the meta-progression to support it.

### Phase 3: Arcade Escalation (`experimental` branch)
Complete redesign: one smoothly-scaling gun, kill streaks, element floor zones (fire/ice/lightning), orbital companions, shockwave blast replacing the dash, power-ups (Rage, Shield, Triple Shot, Nuke).

**What worked:** Smooth scaling created a natural curve; streaks rewarded aggression; elements added variety without menus.
**What didn't:** No build identity between runs; element zones were situational rather than a build; the single gun capped the fantasy.

### Phase 4: NECROWAVE Build System v2 (`prototype` branch — CURRENT)
The current game. Key pillars:

- **TRENCH campaign** — 40 sections across 4 domains, designed wave compositions (≤3 enemy types per encounter, each comp has a role), layout templates chosen per enemy roster, shop after sections, boss at each domain boundary, checkpoint resume.
- **ARCADE mode** — wave-based score chase: streak multipliers (Double → Godlike), themed special waves (Swarm, Heavy Metal, Runner Storm, Showdown), boss every 5 waves, bonus rounds, local top-10 leaderboard. No mods — pure weapon sandbox.
- **The Shell** — staging room between runs: weapon racks (pick a PRIMARY: Sidearm / Ripper / Deadshot, each bundled with a paired SPECIAL: Beacon / Discharge / Payload), and meta terminals — THE FORGE (permanent stat boosts bought with BITS).
- **Class/card build system** — `UPGRADE_POOL`: cards across common/rare/epic/legendary feeding 5 classes (Thermal, Cryo, Arc, Pulse, Corrupt) and 6 statuses (Overheat, Chill, Frozen, Shocked, Exposed/SLIDE, Compromised). 8 legendary capstones (RUNAWAY CORE, ABSOLUTE ZERO, TESLA WEB, SINGULARITY CORE, GREY GOO, OVERDRIVE PROTOCOL, BLADESTORM, DEAD EYE), max 1 per run, with a pickup ceremony.
- **The dash is back** — 1-2 charges, i-frames, class-imbued trails/effects; a core build tool, not just a dodge.
- **Telegraph + reaction language** — elite attacks have windup poses (squash/stretch, shake, halos via `z._tele`); damage has physical hit reactions (recoil + jelly squash via `triggerHitReact`).

Older modes (`survival`, `gauntlet`, `descent`, `siege`, `horde`, `dungeon`) still exist in code and partially work, but trench + arcade are the front door and get the polish.

---

## Class & Status System — What Each Does

- **Thermal** — OVERHEAT stacks: DoT, detonation at high stacks, heat spreads on kill at high investment. Crowd damage.
- **Cryo** — CHILL slows; 3 stacks = FROZEN (immobilized ice block, resists knockback). Control. ABSOLUTE ZERO executes frozen enemies below 20% HP.
- **Arc** — SHOCKED chains lightning between enemies; storm-dash and conductor mods widen the web. Multi-target.
- **Pulse** — kinetic class. SLIDE/Exposed is a knockback amp state (~3x) with wall-slam bonus damage, not a damage amp. Spacing and slams.
- **Corrupt** — the amplifier. CORRUPT stacks escalate damage taken from ALL sources; at COMPROMISED the target takes ~2x. Spreads on death with investment.

Design rule (from CLAUDE.md): at 3+ stacks of investment something QUALITATIVE must happen, not just bigger numbers.

---

## Enemies & What We Learned

`ZOMBIE_TYPES` has ~30 archetypes + 4 boss types (firewall, archivist, watchdog, summoner). Categories:

- **Melee pressure:** normal, fast, prowler, drone, leaper, stalker (ambusher)
- **Heavies:** tank, brute, bull (charger), crusher, anchor, reaper, lash
- **Ranged:** spitter, mini (sniper), strafe, scatter, disc, mortar, artillery, caster, splasher
- **Special mechanics:** exploder, splitter, shieldbot (aura), phaser (teleports), lancer, grappler, beam (sweeping laser)

**Key lessons (still true):**
- Every enemy needs a distinct silhouette AND a distinct forced response. Slow damage sponges are boring.
- Telegraphs make threats fair: the windup pose/shake/halo language is what lets hard attacks feel earned.
- ≤3 distinct enemy types per encounter, each comp reinforcing one role, beats random soup.

---

## Hard Lessons Learned

### 1. Arena dimensions must be mutable
`ARENA_W`/`ARENA_H` were originally `const`. The Descent needed a 16960px tall arena and this broke everything — WebGL grid texture, collision, LOS, bullet bounds, clamping. Fixed with `setArenaDimensions(w, h)`. **Never hardcode arena dimensions.**

### 2. WebGL textures must be power-of-two on mobile
Non-POT grid textures silently fail on mobile GPUs — no error, just black. `uploadDungeonGrid()` pads to the next power of two.

### 3. Visual effects inside `if(isHost)` blocks are host-only
The #1 source of multiplayer bugs. Effects need shared code paths or replication in `applyHostState`. Related: the non-host has TWO local damage signals — predicted bullet contact and the host-sync damage edge — and per-hit visuals (white pop, hit reaction) must fire from both without double-firing.

### 4. Elemental damage couldn't kill
DoT brought enemies to 0 HP outside the bullet loop and nothing processed the death. A "death sweep" at the end of the enemy update catches 0-HP enemies.

### 5. Player bullets should NOT be synced
Syncing bullets was laggy and wasteful. Each client renders its own bullets from firing state; only enemy projectiles sync. Visually identical, far less bandwidth.

### 6. Performance is a design constraint, not an optimization pass
iOS heat forced a 60fps cap and a `shadowBlur` ban (fake glow: bigger dimmer shape behind the bright one). Hit-stops/slow-mo over ~60ms feel like jank, not impact. Smoothness beats spectacle.

### 7. Slow zombie damage sponges are boring
The bruiser was trivially kited until it got a leap attack. Behavior, not HP, is difficulty.

### 8. Invisible buffs don't exist
If a card/status/synergy doesn't visibly change the screen (damage numbers, body tint, new particles, status label), players behave as if it isn't there. Phase 2 died of this; the status-effect VFX language exists because of it.

---

## Branches

- **`prototype`** — CURRENT active branch. Phase 4: trench campaign, class/card system, Shell, arcade leaderboard, rarity redesign.
- **`experimental`** — Phase 3 arcade-escalation era. Do NOT merge into it unless explicitly asked.
- **`main`** — Phase 1 weapon-based system. Stable but ancient.
- Various spike branches (`auto-aim`, `choice-build`, `crazy-design`, `music-shift`, `new-special`, `redesign`, etc.) — one-off experiments.

---

## Technical Gotchas

- **Single file** — search by name: `generateTrenchMap`, `fireWeaponForPlayer`, `damageZombie`, `applyHostState`, `UPGRADE_POOL`, `ZOMBIE_TYPES`, `TRENCH_DOMAINS`, `WAVE_COMPOSITIONS`.
- **Syntax check after every change** — `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"`.
- **No build step** — `npm start`, open browser. `npm run build:mobile` for the iOS wrapper.
- **Seeded RNG** — all clients generate identical maps from the synced seed. Critical for multiplayer.
- **WebGL lighting with canvas fallback** — lighting tries WebGL first; The Core domain runs fog-free.
- **Capacitor iOS** — `ios/` Xcode project; `MULTIPLAYER_SERVER_URL` must point at a public server for the native app (can't use `location.host`). Native haptics via Capacitor.Plugins.Haptics; a looping near-silent WAV forces the iOS "playback" audio category so sound works with the silent switch on.
- **Mobile detection** — user agent sniffing toggles `mobile`/`desktop` CSS classes and control schemes.
- **The MULTI menu button is currently hidden** on `prototype` (along with FORGE/CHALLENGES/CODEX buttons on the start screen — the Shell exposes Forge in-world). The multiplayer code is live; all multiplayer-first rules in CLAUDE.md still apply.

---

## What Needs Work

- **Balance** (ongoing): the rarity redesign (8 legendary capstones + ceremony) shipped recently; numbers may still need tuning. Difficulty/economy audits live in the `/difficulty-audit` skill.
- **Performance batch 2** (pending): the shadowBlur→fake-glow sweep needs on-device iOS verification.
- **Legacy modes**: survival/gauntlet/descent/siege/horde are behind the trench/arcade quality bar — decide which to promote, kill, or fold in.
- **Multiplayer re-exposure**: the MULTI button is hidden while the solo loop is polished; re-enabling needs a verification pass over phase-4 systems (cards, specials, telegraphs) in co-op.
- **Sound**: still procedural synth + generated SFX files; no music or ambient loops.
- **Onboarding**: no tutorial — you just start shooting (mostly fine for arcade; trench could use a soft intro).

---

## Monetization Direction

**Free multiplayer, premium single player.** Multiplayer is the growth engine (play with friends, tell others). Single player is the deep, progression-rich experience worth $5-7. See `IDEAS.md` / `IDEAS_V2.md` for the full plan.

---

## File Map

| File | Purpose |
|------|---------|
| `index.html` | The entire game — HTML + CSS + JS (~40,000 lines) |
| `server.js` | WebSocket relay server + static file serving |
| `CLAUDE.md` | Technical architecture + design principles for Claude Code |
| `BACKGROUND.md` | This file — history, decisions, vibe |
| `IDEAS.md` / `IDEAS_V2.md` | Future features and monetization plans |
| `STEERABILITY.md`, `dash_system.md`, `build_system.md` | Deep-dive design notes for specific systems |
| `manifest.json` / `sw.js` | PWA install + offline caching |
| `capacitor.config.ts`, `build-mobile.sh`, `ios/`, `www/` | iOS wrapper build |
| `sounds/`, `generate-sounds.js` | Generated sound effects |
| `Context/` | Archived Unity assets (gitignored, unused) |
