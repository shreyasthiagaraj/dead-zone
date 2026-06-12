# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Game Description
- **NECROWAVE** is a top-down arcade roguelike shooter with a cyber-horror setting: the player fights corrupted digital entities through the domains of a hostile system (Entry Cache → Corrupted Subnet → Deep Storage → The Core). It is meant to be easy to pick up and play with minimal setup — fun, challenging, frantic real-time shooting with neon gore and glitch-horror atmosphere. Mobile-first, 10-20 minute sessions.
- The two front-door modes are **TRENCH** (the 40-section campaign: fight → shop → fight, boss at each domain boundary, checkpoint resume) and **ARCADE** (wave-based score chase with multikill streaks and a local leaderboard). Runs start from **The Shell**, a staging room with weapon racks and meta terminals (FORGE permanent upgrades bought with BITS).
- The build system is the heart of the game: mod cards across 4 rarities (common/rare/epic/legendary, 8 legendary capstones) feed 5 elemental classes — Thermal, Cryo, Arc, Pulse, Corrupt — each with its own status effect and qualitative payoffs at higher investment.

## Shell Commands
- Never chain commands when the `cd` command is involved, Use separate parallel Bash tool calls instead — they run concurrently and don't trigger permission prompts.


## Running the Game

```bash
npm start          # Starts server on port 3000 (or PORT env var)
```

Open `http://localhost:3000` in a browser. No build step — the game is a single `index.html` served statically.

## Architecture

**Single-file browser game** with a Node.js WebSocket relay server.

- `index.html` — Complete game: HTML, CSS, and all JavaScript in one file (~40,000 lines). Canvas-based 2D renderer (WebGL lighting with canvas fallback), procedural map generation, weapon/mod/class systems, enemy AI, mobile touch controls, PWA support, and multiplayer client.
- `server.js` — Stateless WebSocket server using `ws`. Handles lobby creation/joining (4-char codes, max 4 players) and relays messages between clients. Also serves static files over HTTP.
- `sw.js` / `manifest.json` — PWA service worker + installable fullscreen manifest.
- `ios/` + `capacitor.config.ts` + `build-mobile.sh` — Capacitor iOS wrapper (native haptics, audio session handling). Build with `npm run build:mobile`.
- `Context/` — Archived Unity project assets (not used by the live game, gitignored).

**Game modes** (set via `gameMode`): `trench` (main campaign) and `arcade` are the modes exposed on the main menu today. `survival`, `gauntlet`, `descent`, `siege`, `horde`, and `dungeon` exist in code from earlier eras — some are reachable via hidden/secondary menus, all are lightly maintained. The MULTI menu button is currently hidden (`display:none`) on the prototype branch, but the multiplayer code paths are live and all the multiplayer rules below still apply.

## Game Architecture (inside index.html)

**Host-authoritative multiplayer**: The host runs all game simulation (zombie AI, damage, spawning, level transitions). Non-host clients send input and receive authoritative game state. Zombies, pickups, and barrels are synced from host to clients every 3 frames. Player bullets are rendered locally on each client (not synced) — only zombie projectiles are transmitted. HP and alive state are host-authoritative.

**Key systems:**
- **Trench generation** (`generateTrenchMap`): Seeded RNG for deterministic maps across clients. 40 sections across 4 domains (`TRENCH_DOMAINS`), each section built from a layout template chosen to fit its enemy roster. Encounters are designed compositions (`WAVE_COMPOSITIONS`) capped at ≤3 distinct enemy types per wave.
- **Loadout**: Player picks a PRIMARY in the Shell/arcade picker (`PRIMARY_WEAPON_OPTIONS`: Sidearm / Ripper / Deadshot); each primary is bundled with a paired SPECIAL (`SPECIAL_DEFS`: Beacon turret / Discharge wave / Payload grenade). The full legacy arsenal still lives in `WEAPON_DEFS` (used by arcade pickups and older modes; `MAX_WEAPONS = 3`).
- **Build system** (`UPGRADE_POOL`): mod cards bought in the shop, drafted by rarity weight. 5 classes (Thermal/Cryo/Arc/Pulse/Corrupt), 6 statuses (Overheat, Chill, Frozen, Shocked, Exposed/SLIDE — kinetic knockback state, Compromised — the damage amp). Active mods live in `runMods`.
- **Enemies** (`ZOMBIE_TYPES`): ~30 archetypes + 4 boss types (firewall, archivist, watchdog, summoner). Telegraph system (`z._tele`, `_drawTelegraph`) drives windup poses/shake; hit reactions (`triggerHitReact`/`_hitReactVisual`) drive recoil + jelly squash on damage.
- **Meta progression**: BITS currency + THE FORGE (permanent stat boosts), arcade local leaderboard, mid-run checkpoint save/resume (`hasMidRunSession`).
- **Fog of war**: Offscreen canvas with `destination-out` compositing (WebGL path with canvas fallback). Each player has an ambient glow + directional flashlight beam that respects line-of-sight. The Core domain disables fog.
- **Mobile controls**: Dual virtual joysticks (left=move, right=aim/shoot) + action buttons (dash, special, mark). Platform detected via user agent; CSS classes `mobile`/`desktop` toggle layouts.

## Multiplayer Protocol

WebSocket messages are JSON. Key types:
- `create_lobby` / `join_lobby` → `lobby_created` / `lobby_joined`
- `start_game` → `game_start` (broadcasts seed)
- `game_state` (host→clients): players (pos, hp, alive, dash, firing, reload, weapon), zombies, zBullets, pickups, barrels, score, kills, level, levelSeed, gameMode, survivalWave
- `player_input` (client→host): position, angle, firing state, weapon inventory, dash state, reload state, perks, maxHp (NOT hp/alive — those are host-authoritative)

## Multiplayer-First Development

Every feature and bug fix MUST be verified against multiplayer before finalizing. This game is primarily played with friends — multiplayer is the main mode, not an afterthought. Before committing any change, check:

- **Visual effects** (particles, screen shake, damage flash, floating text): Do they trigger on BOTH host and non-host? Effects driven by host-only code (e.g. `damageZombie`, zombie AI) won't appear on non-host unless explicitly handled in `applyHostState` or a shared code path.
- **Player state**: HP, alive, and maxHp are HOST-AUTHORITATIVE. Never accept HP/alive from client input. The non-host receives these via `game_state` sync only.
- **Perk effects**: Use `getPlayerPerkCount(p, id)` / `playerHasPerk(p, id)` — never bare `getPerkCount(id)` — so perks apply correctly for both local and remote players.
- **Bullet rendering**: Player bullets are LOCAL (not synced). Each client generates visual bullets from firing state. Only zombie projectiles (spitters) are synced.
- **Pickups**: Both host and non-host run `tryPickup` locally. Host also runs pickup for remote players. The host's pickup array is authoritative.
- **New synced state**: If adding new state that affects gameplay or visuals across clients, add it to either `player_input` (client→host) or `game_state` (host→clients) as appropriate.
- **`if(isHost)` blocks**: Any visual effect created inside these blocks will ONLY appear on the host. If non-host players should see it too, either move it to a shared path or add equivalent logic in `applyHostState`.

## Stage Design Principles

These principles govern ALL stage generation, layout, hazard placement, and visual design. Apply them to every stage-related change.

1. **Every obstacle creates a decision, never a dead end.** A pillar forces "left or right?" Two pillars too close forces "I'm stuck." One is gameplay, the other is frustration. MINIMUM 4-cell gap between any two obstacle clusters.

2. **Always 2+ viable paths.** The player should never be funneled into a single chokepoint. After placing obstacles, flood-fill from spawn to door must succeed with at least 2 independent routes.

3. **Spawn zone is sacred.** 5-cell radius from the player entrance must be obstacle-free. The player needs a beat to read the room before combat starts.

4. **Enemy-aware layout.** Beam arrays need sightlines. Chargers need dodge space. Shambler swarms need open ground. The template must serve the encounter, not fight it. Select layout templates based on the section's enemy roster.

5. **Readable at a glance.** The player should understand the full layout within 1 second. No hidden dead-ends. No ambiguous geometry. Obstacles must be large enough to see but not so numerous they clutter.

6. **Progressive complexity.** Sections 1-3: open arenas. Sections 4-8: one strategic structure. Sections 9+: multi-element layouts with paths and cover. Complexity ramps with skill, never front-loads.

### Visual Domains (sections → themes, see `TRENCH_DOMAINS`)
- **Domain 1 (sections 0-9):** Entry Cache — magenta (#b06), clean grid floor, dust ambient
- **Domain 2 (sections 10-19):** Corrupted Subnet — orange (#f60), checker floor, embers, 1.5x glitch
- **Domain 3 (sections 20-29):** Deep Storage — cyan (#4ef), frost floor, ice ambient, eerie calm
- **Domain 4 (sections 30+):** The Core — white/gold on black, wireframe, self-lit, no fog, 2.5x glitch

### Layout Templates
Arena, Crossroads, Corridor, Pillars, L-Shape, Split, Islands, Bunker, Gauntlet — each designed for specific enemy compositions. Template is selected based on the section's enemy types, not randomly.

## Combat & Difficulty Principles

These principles govern ALL balance, combat feel, power scaling, and difficulty tuning. This is a **mobile-first arcade roguelike** — controls are thumbs, sessions are 10-20 minutes, and every interaction must be immediately satisfying.

### What makes this game fun (protect these at all costs)
- **The gun feel.** Screen shake, neon particles, hit feedback, gore. The shooting FEELS good.
- **The dash.** Glitch burst, invincibility, elemental trails, phasing through enemies. A moment of power.
- **Room clears.** The relief + accomplishment when the last zombie falls and the door opens.
- **Power-up spikes.** RAGE, TRIPLE SHOT, SHIELD — brief moments of godhood that the player craves.
- **The narrative.** Memory fragments, domain shifts, whispers. Uniquely ours.

### The 10 Principles

1. **Every upgrade must be FELT immediately.** If buying a damage card doesn't change the number of shots to kill the most common enemy within ONE purchase, the card is too weak. Reference: Brotato — every stat change visibly alters gameplay within one wave. Minimum per-card impact: changes time-to-kill by at least 1 bullet on the current section's standard enemy.

2. **The difficulty curve is a ramp, not a wall.** The player should feel "I need to dash more" around section 8, "I need element builds" around section 12, and "I need a full build to survive" at section 18. Difficulty should NEVER spike — it should tighten gradually. Enemy HP scaling alone is not difficulty — behavioral changes, new enemy combos, and environmental pressure are.

3. **Stacking unlocks qualitative changes, not just quantitative.** At 3+ stacks of any element, something NEW should happen (fire enemies explode on death, ice enemies shatter for AoE, lightning chains further, wind creates persistent vortexes). Pure "+X% more" is invisible to the player. Reference: Vampire Survivors — weapon evolutions at max level.

4. **Power-ups are the dopamine — loud, frequent, short.** A 15-second RAGE should feel like GOD MODE: screen tint, sound change, massive damage, enemies flinching. Frequency: 4-8 per run. Duration: short enough that you MISS it when it ends. The gap between power-ups is what creates desire.

5. **The player should be 3× stronger at section 15 than section 1.** This is the roguelike promise: investment = power. By mid-run, the player should be clearing rooms that would have killed them at section 3. If cards don't compound into noticeable power growth, the system has failed. The power fantasy IS the product.

6. **Mobile-first: every interaction works with thumbs.** Auto-fire at full joystick extension. One-button dash. Big tap targets in menus. No precision aim requirements. Session length: 10-20 minutes. No punishment for pausing or closing the app.

7. **Rest beats matter.** Between combat bursts, the player needs 2-3 seconds of breathing room. Transition between waves, shop visits, domain announcements, dash cooldown downtime. Don't eliminate rest — pace it. Combat→rest→combat rhythm is what makes both halves feel good.

8. **Enemy variety > enemy volume.** 6 enemies with distinct behaviors beat 15 with different HP pools. Each enemy type should force a DIFFERENT player response: "dodge the charge," "flank the shield," "prioritize the beam array," "don't stand in the spitter's line." If two enemy types demand the same response, one is redundant.

9. **Clear feedback on damage dealt and received.** Damage numbers, health bar changes, screen flash on hit, distinct sounds per weapon. The player should always know "am I winning?" at a glance. When a card makes them stronger, the damage numbers should visibly change.

10. **The run tells a mechanical story.** Early game: survive with the base pistol. Mid game: build power through the shop. Late game: test the build against harder combinations. Endgame: "can my build reach The Core?" Every run should have a beginning, middle, and climax — even failed ones.

### Balance Reference Points (target values)
- Section 1 shambler should die in 5-6 pistol shots at close range
- Section 10 shambler should die in 3-4 shots with a reasonable build
- Section 15 shambler should die in 2-3 shots with a strong build
- RAGE power-up should feel like clearing the room in half the time
- A fully built fire+shockwave dash should clear 60%+ of a normal wave
- The player should see 4-8 power-ups per run and visit the shop 5-8 times

## VFX Design Principles

These principles govern ALL visual effects work. Learned through extensive iteration on the gun/bullet system, dash, hit impacts, enemy attacks, and status effects.

### Philosophy: Effects Are Feelings, Not Decorations
Every VFX must communicate **what just happened** and **how powerful it was**. If the player can't feel the difference between a normal shot and a class-empowered shot at a glance, the VFX has failed. Go BIGGER than you think is right, then dial back 10%.

### The Three-Point Rule
Every action needs VFX at three points:
1. **Origin** — explosion/burst where the action starts (gun muzzle, dash launch, ability cast)
2. **Path** — trail/streak/smoke showing how the force traveled (beam dashes, smoke, sparks)
3. **Impact** — explosion/ring/sparks where the force lands (enemy hit, endpoint, wall collision)

If any of these three is missing, the action feels weak. The origin and impact should be the loudest; the path connects them.

### Hitscan Gun VFX Model (reference implementation)
The gun doesn't fire a "bullet" — it fires a **force transfer**. The projectile is invisible (speed 300, life 2). What the player sees:
- **Muzzle detonation**: radial spark burst + smoke cloud + expanding flash ring
- **Beam trail**: short colored line dashes (class-colored, tapered thick→thin) drifting forward with gaps. NOT a solid line. Surrounded by class-tinted smoke (organic ellipse shapes, not perfect circles).
- **Endpoint explosion**: expanding ring + radial sparks + smoke + cross-flash lines. Bigger on hit than on miss.
- **Raycast**: beam VFX stops at the first enemy or wall (don't draw through targets).

### Class Identity Through VFX
When a class (Thermal/Cryo/Arc/Pulse/Corrupt) is active, it must transform the ENTIRE visual:
- **Beam color**: the core line, dashes, sparks, and endpoint rings ALL change color
- **Smoke tint**: each class has its own dark smoke color (fire=dark orange, ice=dark blue, arc=dark cyan, corrupt=dark purple)
- **Unique particles**: fire=rising flame sparks, ice=frost crystals scattering sideways, arc=forking lightning bolts, pulse=expanding shockwave rings, corrupt=glitch text characters
- If it still looks like the default yellow beam with a couple extra particles, it's NOT ENOUGH. The whole shot identity must change.

### Performance Rules
- **NEVER use `shadowBlur`** — it's the #1 Canvas2D performance killer. Use "fake glow" instead: draw a larger, dimmer shape behind the bright shape.
- Use geometric draws (arc, lineTo, fillRect) not gradients for particles
- Smoke uses organic squashed ellipses (ctx.scale with stable per-particle rotation), not perfect circles
- Lightning particles draw jagged segmented lines between two points — line width and color driven by `p.size` and `p.color`
- Per-bullet `_vfxSeed` (stable random) ensures visual variety without per-frame randomness
- Particle type `'smoke'` uses `_smokeAlpha` for per-particle translucence control

### Exaggeration Scale
- **Dash**: screenshake + glitch surge + expanding ring + 16 sparks + 7 speed lines + 3 directional flash lines + 5 glitch chars + bass thump. This is the MINIMUM for a major action.
- **Gun shot**: 14 muzzle sparks + 5 smoke puffs + flash ring + beam trail + endpoint explosion. Every single shot.
- **Enemy hit**: segmented ring + outer wake ring + 8-16 radial sparks + smoke puffs + center flash. Every hit.
- **Status effects**: floating text label on application (CHILL x2, EXPOSED, etc.) + per-frame particles on affected enemies + distinct body color change.
- When in doubt, ADD MORE. It's easier to dial back than to make something feel impactful after the fact.

### Common Mistakes to Avoid
- Gray/dark smoke on a dark background is invisible. Use class-tinted smoke or bright smoke.
- A solid line from point A to point B looks like a laser, not a gunshot. Use SHORT DASHES with gaps, drifting forward.
- Perfect circles for smoke look artificial. Use overlapping offset ellipses.
- Effects that are the same size regardless of context (crit vs normal, exposed vs not) miss an opportunity for feedback scaling.
- Static effects feel dead. Add small drift velocity, rotation, or pulse to everything.

## Development Notes

- No test suite or linter configured.
- All game logic is in a single `<script>` tag (~40,000 lines) — search by function/constant name (e.g., `generateTrenchMap`, `fireWeaponForPlayer`, `damageZombie`, `applyHostState`, `UPGRADE_POOL`, `ZOMBIE_TYPES`, `TRENCH_DOMAINS`).
- Syntax check: `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` — validates JS without running the game. Run this after every change.
- The game auto-detects mobile via user agent and exposes different control schemes and CSS layouts accordingly.
- Performance is a hard constraint (mobile/iOS heat): 60fps cap, no `shadowBlur` in hot paths (use fake glow), no hit-stops/slow-mo over ~60ms. The game must stay buttery smooth.
- Active development branch is `prototype`. `main` and `experimental` are older eras of the design (see `BACKGROUND.md`).
