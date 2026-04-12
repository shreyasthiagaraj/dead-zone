# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Game Description
- This is a top down zombie survival shooter game. The game is meant to be easy to pick up and play with minimal setup. it should be fun, challenging, and frantic real time shooting survival game with elements of horror and gore. Gameplay involves navigating a maze of hallways looking for a way out while gunning down zombies with a variety of weapon types. It should be dark, gory, and fun. 

## Shell Commands
- Never chain commands when the `cd` command is involved, Use separate parallel Bash tool calls instead — they run concurrently and don't trigger permission prompts.


## Running the Game

```bash
npm start          # Starts server on port 3000 (or PORT env var)
```

Open `http://localhost:3000` in a browser. No build step — the game is a single `index.html` served statically.

## Architecture

**Single-file browser game** with a Node.js WebSocket relay server.

- `index.html` — Complete game: HTML, CSS, and all JavaScript in one file (~1400 lines). Canvas-based 2D renderer, procedural dungeon generation, weapon system, zombie AI, fog-of-war lighting, mobile touch controls, and multiplayer client.
- `server.js` — Stateless WebSocket server using `ws`. Handles lobby creation/joining (4-char codes, max 4 players) and relays messages between clients. Also serves static files over HTTP.
- `Context/` — Archived Unity project assets (not used by the live game, gitignored).

## Game Architecture (inside index.html)

**Host-authoritative multiplayer**: The host runs all game simulation (zombie AI, damage, spawning, level transitions). Non-host clients send input and receive authoritative game state. Zombies, pickups, and barrels are synced from host to clients every 3 frames. Player bullets are rendered locally on each client (not synced) — only zombie projectiles are transmitted. HP and alive state are host-authoritative.

**Key systems:**
- **Dungeon generation**: Seeded RNG for deterministic maps across clients. Rooms connected in a winding chain via greedy nearest-neighbor, with the exit forced last. Corridors are L-shaped.
- **Weapons**: Defined in `WEAPON_DEFS` object. Players carry max 3 guns (configurable via `MAX_WEAPONS`). Dropping a weapon spawns a pickup with a cooldown timer to prevent re-pickup loops.
- **Fog of war**: Offscreen canvas with `destination-out` compositing. Each player has an ambient glow + directional flashlight beam that respects line-of-sight.
- **Mobile controls**: Dual virtual joysticks (left=move, right=aim/shoot). Platform detected via user agent; CSS classes `mobile`/`desktop` toggle layouts.

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

### Visual Domains (sections → themes)
- **Domain 1 (1-5):** Entry Cache — purple/magenta/cyan, clean, sterile
- **Domain 2 (6-10):** Corrupted Subnet — red/orange, cracked, sparking
- **Domain 3 (11-15):** Deep Storage — blue/teal, ice/frost, eerie calm
- **Domain 4 (16-20):** Kernel Boundary — hot magenta/red, burning, hostile
- **Domain 5 (21+):** The Core — white/gold on black, wireframe, self-lit, no fog

### Layout Templates
Arena, Crossroads, Corridor, Pillars, L-Shape, Split, Islands, Bunker, Gauntlet — each designed for specific enemy compositions. Template is selected based on the section's enemy types, not randomly.

## Development Notes

- No test suite or linter configured.
- All game logic is in a single `<script>` tag — search by function name (e.g., `generateDungeon`, `fireWeaponForPlayer`, `applyHostState`).
- Syntax check: `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` — validates JS without running the game.
- The game auto-detects mobile via user agent and exposes different control schemes and CSS layouts accordingly.
