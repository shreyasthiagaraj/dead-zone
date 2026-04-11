# NECROWAVE — Design Overhaul v2

Comprehensive play-style review and implementation plan. This doc captures the full analysis, the gaps identified, and the design for everything being added in the v2 overhaul. Keep this alongside `BACKGROUND.md` and `CLAUDE.md`.

---

## Where The Game Stands

**Strengths (genuinely good):** combat feel, hit/gore/shake feedback, synthwave+horror identity, distinct enemy behaviors, multiple modes, working multiplayer, excellent Trench structure, element-zones-via-chests adds tactical texture.

**Critical gap:** the game is a sequence of isolated runs with **no accumulation**. Every run mechanically identical. No meta progression. No build diversity per run. No mid-tier reward cadence (survivor-likes level you up every 15–30s; this game silently scales the gun). A player's 1st run is mechanically the same as their 100th. That is the retention killer.

---

## Scorecard Against Core Principles

| # | Principle | Grade | Notes |
|---|---|---|---|
| 1 | Immediate competence | A– | Auto-fire + scaling = feels good fast |
| 2 | Micro-decisions | C+ | Missing XP-orb chase loop |
| 3 | Feedback loops | A | Juice is one of the best parts |
| 4 | Escalation curve | B | Trench does it well; others plateau |
| 5 | **Build diversity** | **D** | **No per-run build. Every run identical.** |
| 6 | **Long progression** | **F** | **No meta. No unlocks. No reason tomorrow.** |
| 7 | Near-miss psychology | C | Smooth gun scaling robs level-up-then-die moments |
| 8 | Readable chaos | C+ | Synthwave+fog+CRT+particles can drown the player in crowds |
| 9 | Rhythm/flow | B+ | Trench flows; siege rest periods break it |
| 10 | Reward cadence | C | Mid-tier is empty |
| 11 | Enemy design | B | Good variety; missing elite/rare tier |
| 12 | Power fantasy curve | C+ | Temporary buffs don't stack into a peak moment |
| 13 | Low friction | A– | 6 modes = mild decision paralysis |
| 14 | **Meta hooks** | **F** | **None** |

---

## The Four Gaps That Actually Matter

1. **No XP/level-up loop** — single most impactful gap. Survivor-likes live on this.
2. **No meta progression** — no persistence between runs.
3. **No build identity per run** — runs are mechanically identical.
4. **Six modes, no flagship** — Trench should be THE mode.

---

## v2 Implementation Plan

### Phase 1 — XP Orbs + Level-Up Cards (SHIPPING NOW)

**Core loop:**
```
kill → orb drops → player runs to orb → orb magnets in → XP bar fills
→ ding + slow-mo → 3 cards appear → player picks → card stacks for run
→ repeat every 15–30s
```

**Orb drop rates:**
- 90% of normal kills drop an orb
- 100% of elite/boss kills drop a bigger orb
- Orb value scales with zombie tier (shambler=1, fast/spitter=2, tank=3, bruiser/sniper=4, boss=15)

**Orb magnet:**
- Pickup radius ~70px (extendable via perks)
- When player enters magnet range, orb accelerates toward player with easing
- Collected on contact

**Level curve:**
- Level 1→2: 10 XP
- Formula: `xpNeeded(n) = floor(8 + n*3 + n*n*0.5)`  → smooth ramp
- Target: level up every 15–25s early game, every 30–45s mid game

**Level-up sequence:**
1. Player crosses XP threshold
2. Game freezes (`gameState = 'levelup'`)
3. Dim overlay fades in
4. 3 upgrade cards slide in from below (or column on mobile)
5. Each card: icon, name, rarity color (common/rare/epic/legendary), description, current count if stacking
6. Player taps/clicks a card
7. Card flies up to HUD, upgrade applied, game resumes
8. Floating text: "LEVEL UP!"

**HUD addition:**
- XP bar above score (thin neon bar, fills with cyan)
- Level number next to bar
- Pulse animation on level up

### Phase 2 — Run-scoped Upgrade Pool (SHIPPING NOW)

**Categories & cards (~25 total):**

**Offense (common, stacks)**
- `Savage Rounds` +15% damage
- `Rapid Fire` +12% fire rate
- `Overpenetrator` +1 pierce
- `Bigger Bullets` +20% bullet size
- `Critical Strike` +5% crit chance (cap 50%)
- `Overkill` +50% crit damage
- `Hollow Points` +25% damage vs < 50% HP targets

**Elements (rare)**
- `Pyromaniac` 25% chance to ignite on hit
- `Frostbite` 20% chance to slow on hit
- `Chain Reaction` 10% chance bullet chains to nearest enemy
- `Slipstream Bullets` +2 permanent bullet pierce (wind)

**Area/Orbital (epic)**
- `Orbital Ring` spawn one permanent orbital (stacks adds more)
- `Shockwave Mastery` -25% blast cooldown
- `Bigger Blast` +30% blast radius
- `Death Explosion` enemies explode for 25 dmg on death (stacks increase damage)

**Survival (common)**
- `Vampirism` +1 HP per kill
- `Reinforced` +25 max HP
- `Adrenaline` +15% fire rate when <50% HP
- `Thick Skin` -5% damage taken (cap 40%)

**Mobility/Utility (common)**
- `Swift Boots` +10% move speed
- `Magnetism` +50% XP pickup radius
- `XP Amplifier` +20% XP gain
- `Lucky` +15% chest drop rate

**Unique/Legendary (1 copy only)**
- `Second Chance` revive once per run with 50% HP
- `Berserker` +60% damage, -25% max HP
- `Ghost Bullets` bullets pass through walls
- `Fragmentation` bullets split into 2 on impact

**Card rarity weighting (per level-up):**
- Common: 60% chance in pool
- Rare: 25% chance
- Epic: 12% chance
- Legendary: 3% chance (only once per run)

### Phase 3 — Meta Progression: Necro-Shards + Crypt

**Shard currency:**
- Earned on run end: `floor(score/1000 + kills*2 + progression*15)`
- Doubled on personal best
- Stored: `localStorage['necrowave_shards']`

**The Crypt (permanent upgrade tree):**

Accessed from start screen via new `CRYPT` button. Grid of nodes:

1. **Vitality** — +10% max HP per level (max 5) — 20/40/80/160/320 shards
2. **Power** — +5% base damage per level (max 5) — 25/50/100/200/400
3. **Swiftness** — +3% move speed per level (max 3) — 30/60/120
4. **Fortune** — +5% XP gain per level (max 5) — 20/40/80/160/320
5. **Magnetism** — +25% pickup radius per level (max 3) — 25/50/100
6. **Executioner** — +2% crit chance per level (max 5) — 30/60/120/240/480
7. **Harvest** — +10% shard gain per level (max 5) — 40/80/160/320/640
8. **Arsenal** — start run with +1 random upgrade per level (max 3) — 80/200/500
9. **Regen** — heal 1 HP every 10s per level (max 3) — 50/120/300

These apply as passive modifiers at `startSoloGame` / `startMultiplayerGame`.

### Phase 4 — Menu Restructure

**New start screen:**
```
        NECROWAVE

   [ ▶ PLAY ]    ← default: Trench, straight in
   [ CRYPT ]     ← meta upgrade tree
   [ CHALLENGES] ← other modes (horde/siege/descent/gauntlet/survival)
   [ MULTI ]
   [ CODEX ]

   Shards: 420   Level: 12   Best: Section 14
```

- PLAY = the flagship mode (Trench), immediate start
- CHALLENGES = picker for alternate modes, can gate behind unlocks later
- CRYPT = meta upgrades
- Shard counter visible at a glance

### Phase 5 — Near-miss Death Screen (POLISH)

- Show picked upgrades as mini-cards
- "+N Shards earned"
- "Best: Section 9 (you: 7)"
- "[ REVENGE ]" big button — restarts instantly with same mode

### Phase 6 — Nice-to-haves (LATER)

- **Overdrive moments**: 3+ buffs active → gold tint + screen shake + damage boost for 5s
- **Daily Run**: one seeded run per day with leaderboard
- **Character select**: 3–5 survivors with starting twists
- **Readability pass**: enemy outlines, danger telegraphs, particle density throttle in crowds

---

## Files Touched

- `index.html` — main game file (all core work)
- `IDEAS_V2.md` — this design doc

---

## Priority Order (What Ships This Session)

1. ✅ Doc written
2. XP orbs + magnet + collect
3. Level-up card picker UI
4. Upgrade pool (20+ cards wired in)
5. Meta progression: shards + Crypt menu
6. Menu restructure (PLAY = Trench flagship)
7. Death screen polish
8. Commit + push

Phases 6 (nice-to-haves) deferred to follow-up sessions.

---

## Brutal Truth

The action feel is better than most shipped games. The meta layer doesn't exist. **The meta layer is the entire product.** Right now we have a beautifully-juiced demo. With XP loop + meta progression, we have a product people play for months.

No feature in this doc is experimental — it's all proven patterns from Vampire Survivors, Brotato, Holocure, 20 Minutes Till Dawn. The question isn't whether they'll work. It's build order.
