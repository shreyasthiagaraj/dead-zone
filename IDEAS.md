# IDEAS

---

## Third Action Button (Beyond Dash)

The player currently has two verbs: shoot and dash. A third action button would deepen combat rhythm. Constraint: one button, instant, no menu, mobile thumb-friendly.

### Option 1: PULSE (energy burst) — RECOMMENDED
Short-range radial blast centered on player. ~3s cooldown.
- **Base**: Small AoE knockback + damage around the player
- **Design rationale**: Fills "they're too close" gap. Dash = escape, Pulse = stand-your-ground. Creates three-verb loop: shoot (ranged), dash (reposition), pulse (close-range defense).
- **Mod potential**: Apply your element, increase radius, reduce cooldown, lifesteal-on-pulse, lingering zone, double-tap chain

### Option 2: DEPLOY (placeable)
Drop something at your feet — mine, turret, decoy, barrier wall. ~8s cooldown.
- **Base**: Drops a mine that detonates on enemy proximity
- **Design rationale**: Adds spatial/tactical layer — shaping the battlefield. Mobile-friendly (tap = drop at position).
- **Mod potential**: Cards swap deploy type (turret shoots your element, mine applies element AoE, decoy draws aggro, wall blocks projectiles)

### Option 3: OVERLOAD (timed self-buff)
3-second overdrive state. Massive fire rate + speed + i-frames. ~10s cooldown.
- **Base**: 2x fire rate, speed boost, screen tint, dramatic particles
- **Design rationale**: "Pop your ultimate" rhythm. Save for the right moment.
- **Mod potential**: Element explosion on activation, barrier during overdrive, guaranteed crits, taunt + reward

### Option 4: RECALL (teleport back)
First tap = mark position. Second tap within 4s = teleport back, damage trail between points.
- **Base**: Mark → fight → snap back to safety + damage everything in between
- **Design rationale**: Highest skill ceiling. Big brain plays. Dash forward, mark, recall out.
- **Mod potential**: Return damage buff, elemental trail, extended window, beacon explosion on recall

---

## Monetization (Near-Term, Mobile-First)

### Ethical / Mobile Standard
- **Ad-for-Bits**: Watch an ad to double death rewards. One per run. Industry standard, low friction.
- **Starter Pack**: One-time purchase. Permanent +10% bit bonus + exclusive skin. Good value anchor.
- **Revive Token**: Continue from death (premium currency or ad watch). Capped at 1 per run so it doesn't trivialize difficulty.

### Cosmetic (No Gameplay Advantage)
- **Player Skins**: Different character visuals, dash trail colors, death effects.
- **Bullet Skins**: Neon trails, custom colors, particle effects per weapon type.
- **Shell Customization**: Decorate The Shell staging area with trophies, banners, ambient effects.

### Progression
- **Battle Pass / Seasonal Challenges**: Rotating objectives that unlock cosmetic tiers. Free tier + premium tier.
- **Daily Challenges**: "Kill 50 enemies with cryo rounds" — rewards bits, cosmetic tokens.
- **Leaderboard Seasons**: Weekly/monthly competitive runs. Top players get exclusive cosmetics.

### Premium Currency
- "Cores" bought with real money or earned very slowly through play.
- Cores buy: cosmetic skins, revive tokens, XP boosters (temporary +50% bits for 3 runs).
- Cores NEVER buy: gameplay power. No pay-to-win. Upgrades must be earned through play.

### Retention
- **Daily Login Reward**: Small bit bonus for each consecutive day. Resets on miss.
- **Achievement System**: Permanent unlock goals that grant bits + cosmetics.
- **Prestige System**: After beating the game, reset run progress for a permanent multiplier.

---

# Future Ideas — Roguelite Progression

## 1. Meta-currency + Permanent Upgrades
- Zombies drop "Dark Essence" that persists after death
- Between-runs upgrade screen (like Hades' Mirror):
  - +Max HP, +Move Speed, +Starting Damage, +Dash recharge
  - Unlock new starting elements (start with fire/ice/lightning unlocked)
  - Unlock orbital slots, larger shield HP pool, longer power-up duration
  - "Blood Bank" — keep a % of health pickups as essence on death

## 2. Unlockable Weapons / Starting Loadouts
- First run: always start with pistol
- Milestones unlock new starting weapons (kill 500 zombies, survive 3min horde, clear dungeon level 5)
- Each weapon has an upgrade track (spend essence to improve base stats across future runs)

## 3. Run Modifiers / Mutators
- Unlockable "curses" toggled before a run for bonus essence:
  - "Glass Cannon" — 50% HP, +40% damage
  - "Endless Night" — smaller flashlight, more zombies, 2x essence
  - "Famine" — no health drops, kills heal 1 HP
- Adds replayability, lets skilled players accelerate progression

## 4. Character / Class System
- Unlock different characters with unique passives:
  - **Gunner** — faster fire rate, slower move speed
  - **Scout** — faster movement, wider flashlight, less damage
  - **Pyro** — fire element always active but weaker, immune to burn
  - **Tank** — more HP, slower, shockwave has bigger radius
- Each character has their own unlock tree

## 5. Persistent Bestiary / Codex
- Track zombie types encountered, weapons found, elements used
- Completing entries gives small permanent bonuses ("killed 100 Bruisers → Bruisers take 5% more damage forever")
- Collectionist hook beyond surviving longer

## 6. Run Structure with Choices
- Between dungeon levels / descent sections, offer 2-3 path choices:
  - "Armory" — guaranteed weapon pickup but tougher enemies
  - "Infirmary" — full heal but no loot
  - "Gauntlet" — bonus room with high risk/reward
- Hades/Slay the Spire branching-path model

## Priority Order
1. **Meta-currency + upgrade screen** — this alone turns it into a roguelite
2. **Weapon/character unlocks** — long-term goals beyond high scores
3. **Between-level choices** — makes each run feel unique with minimal rework

---

# Monetization — Single Player Premium, Free Multiplayer

Core idea: multiplayer is free (growth engine), single player is the deep paid experience.

## Core Model: Free Multiplayer, Premium Single Player ($5-7)

### Free Tier
- Multiplayer: all modes, no restrictions
- Single player: horde mode only, no progression, basic pistol

### Paid Unlock — The Roguelite Campaign
- Structured run system (10-15 floors) with escalating difficulty
- Between-floor choices (armory/infirmary/gauntlet)
- Boss fights every 5 floors with unique mechanics
- Ending/credits at floor 15, NG+ with mutators after
- Daily seeded run with leaderboard
- Full meta-progression (essence, upgrade mirror, character unlocks, bestiary)

## Optional Add-Ons ($2-3 each)

### Character Packs
- 2-3 new characters with unique passives and unlock trees
- Mechanically different (melee berserker, turret-placing engineer, etc.)

### Mode Packs
- "The Descent" as premium single player mode with own leaderboard
- "Gauntlet+" — 20 rooms with mid-run shops
- Each mode has its own meta-progression track

### Cosmetic Bundles
- Weapon skins, player trails, death effects
- Show up in multiplayer too — social visibility incentivizes purchase

## Alternative: Ad-Supported Free Model
- All single player content free
- Rewarded ads: "Watch ad to keep essence after death", "Watch ad to reroll floor choice"
- Remove-ads purchase ($3-5) gives all ad rewards permanently

## Revenue Architecture (minimal infra)
- **Payments:** Stripe Checkout or itch.io (browser), App Store IAP (mobile)
- **Save data:** localStorage now, optional cloud save later (JSON blob to server)
- **Leaderboards:** Simple POST endpoint on existing Node server
- **No accounts initially** — tie purchases to device/browser, add accounts later

## Build Order
1. Roguelite campaign structure (between-floor choices, 10-15 floors, boss every 5)
2. Meta-progression (essence + upgrade screen)
3. 2-3 unlockable characters
4. Paywall: free = horde mode, paid = campaign + progression
5. Daily seeded run with leaderboard

---

# Data Cache — Consumable Item System

Single inventory slot displayed bottom-right as a glowing hex chip icon (a data packet you're carrying). Tap to consume. One item held at a time — no inventory management, mobile-friendly.

## Why One Slot Works
- No UI bloat — one icon, one tap, done
- Forces a choice: "do I use this now or save it?"
- Monetization is cleaner with scarcity — one slot means every item feels precious
- Upgradeable to 2 slots via meta-progression (Crypt node: "EXPANDED CACHE")

## Item Sourcing
- **Mod terminal**: occasionally appears as a 4th card option (can't buy a mod AND an item)
- **Rare enemy drops**: elites/bosses have a chance to drop one
- **Between-section reward**: after clearing a tough wave, a cache chip spawns
- **Premium store**: buy a specific item directly (cores currency)

## Item Pool

### Sustain
- **REPAIR KIT** — Restore 40% HP instantly. The bread-and-butter panic item.
- **BARRIER SHARD** — Gain 40 barrier that decays normally. Preemptive defense before a hard room.
- **SECOND WIND** — Auto-revive on death with 25% HP (consumed automatically). Insurance policy.

### Offensive
- **OVERCLOCK** — 5 seconds of 2x fire rate + 1.5x move speed. Pop it for a burst phase.
- **EMP PULSE** — All enemies on screen get Charged (stunned 1s) + projectiles cleared. Panic button with tactical use.
- **VIRAL BOMB** — Throwable: AoE that applies 3 Corrupt stacks to everything in radius. Setup for a Compromised chain.

### Utility
- **PHASE SHIFT** — 3 seconds of invulnerability + ghosted movement (pass through enemies). Escape tool.
- **RESTOCK** — Instantly resets dash cooldown + beacon cooldown. Lets you double-dash or re-deploy.
- **SCANNER PULSE** — Reveals the full section map + highlights all enemies for 8 seconds. Scouting before commitment.

### High-Value / Premium
- **REROLL CHIP** — Reroll the mod terminal's 3 cards. Doesn't cost bits, just the chip. Huge for build-crafting.
- **GOLDEN COMPILE** — Next mod terminal purchase is free (0 bits). Rare, valuable, great premium item.

## Monetization Angles
1. **Starter pack** ($2-3): 3 Repair Kits + 1 Reroll Chip + permanent cache slot unlock
2. **Item crates**: spend cores for a random item (weighted by rarity). Earnable slowly through play.
3. **Pre-run loadout**: before starting, pick one item to carry in. Free players get Repair Kit; premium currency unlocks the full menu.
4. **Ad-for-item**: watch an ad between sections to receive a random item. Capped at 1 per run.

## UI Concept
- Empty slot: dim outline, "EMPTY" text
- Holding item: chip pulses with rarity color (common=cyan, rare=magenta, epic=gold)
- On use: chip shatters into particles, brief cooldown ring prevents double-tap
- Item name appears as floating text on pickup: "REPAIR KIT ACQUIRED"
- Desktop keybind: Q or 1

## Ship Order
- **V1**: Repair Kit + Barrier Shard + EMP Pulse. Three items, one slot, drops from elites and mod terminal. No monetization — prove the mechanic is fun.
- **V2**: Add Overclock + Phase Shift + Reroll Chip. Introduce cores purchase for items.
- **V3**: Pre-run loadout picker, ad-for-item, starter pack.

## Open Questions
- One slot or two? One is cleaner but two lets players combo (Barrier Shard → Overclock → dive in).
- Auto-use items (Second Wind) vs tap-to-use only? Auto-use is more forgiving but less skill-expressive.
- Should items persist between sections or expire? Persisting rewards hoarding; expiring rewards aggressive use.

---

# Special Weapon Alternatives

The special button (currently Beacon) can be swapped for a different ability. Player picks their special in The Shell before starting a run.

## 1. BEACON (current default)
Deploy a turret at your feet. Auto-fires at nearby enemies. Moddable via cards (Trap Mine, Gravity Well, Hazard Zone, element cards). Set-and-forget support fire.

## 2. PULSE NOVA (radial burst)
Short-range radial blast centered on the player. ~3s cooldown.
- **Base**: AoE knockback + damage around the player. Clears projectiles in radius.
- **Fantasy**: "They're too close — push them ALL back." Stand-your-ground defense.
- **Element scaling**: Inherits dominant class. Thermal nova = Overheat ring. Cryo = freeze pulse. Arc = chain stun outward. Pulse = massive knockback + Exposed. Corrupt = corruption zone.
- **Card ideas**: Wider radius, reduced cooldown, lingering zone after burst, double-tap chain nova, lifesteal-on-nova.

## 3. DISCHARGE (short-range cone spray / flamethrower)
Hold special to project a wide cone of energy (~80px range, ~90° angle). Sustained while held, drains a charge bar (2s max). ~5s recharge.
- **Fantasy**: "Come closer, I dare you." Close-range devastation.
- **Element scaling**: Visual and effect change based on dominant class:
  - Thermal: fire stream (classic flamethrower), rapid Overheat stacking
  - Cryo: frost breath / ice spray, rapid Chill stacking, freezes clusters
  - Arc: lightning fan / Tesla coil arc, chain-stun spreading through cone
  - Pulse: concussion wave / wind blast, massive knockback wall + Exposed
  - Corrupt: glitch beam / corruption spray, rapid Corrupt stacking
  - No class: raw energy spray (cyan), light damage + stagger
- **Card ideas**: Wider angle (90°→140°), extended tank (3s), condensed beam (narrow+long), afterburn DOT, walk-and-spray (50% speed while firing), overcharge (final 0.5s = 3x dmg), dual element (alternates between two classes).

## 4. PAYLOAD (grenade launcher)
Lob a grenade in movement direction. Arcs, bounces once, detonates on second impact or after 1.5s. ~4s cooldown.
- **Fantasy**: "I'm controlling WHERE damage happens." Indirect fire around corners and into clusters.
- **Element scaling**: Grenade detonation applies dominant class status in AoE.
- **Card ideas**: Cluster grenade (splits into 3), sticky grenade (attaches to enemy), element grenades (fire puddle, freeze radius, chain lightning, corruption zone), impact detonation (no bounce), bigger blast radius, rapid payload (2 charges).

## 5. DEADSHOT (sniper / charged shot)
Charge a powerful long-range piercing shot. Hold special to charge (0.5-1.5s), release to fire. Full charge = massive damage + screen-width pierce. ~6s cooldown.
- **Fantasy**: "Every other shot is spray. This is the ONE shot that matters."
- **Element scaling**: Full-charge shot applies heavy class status (3x normal application).
- **Card ideas**: Railgun (pierces ALL enemies in line), explosive round (AoE at hit point), tracer round (marks target, bullets home toward it 3s), quick draw (half charge time), overcharge (hold past max for 2x dmg, self-damage if too long), headshot protocol (crit scales with charge time).

## 6. RECALL ANCHOR (teleport back) — SHELVED
Beacon becomes a recall point. Tap again to teleport back with trail damage. Code exists but removed from card pool — dash already covers the escape fantasy. Would need larger arenas or chokepoint mechanics to justify.

## 7. ROCKET / MISSILE (fire-and-forget homing)
Auto-targets highest-HP enemy. Wobbly arc flight, explodes on contact. ~7s cooldown.
- **Fantasy**: Anti-elite skip button.
- **Card ideas**: Multi-lock (3 missiles), seeker swarm (6 tiny), element warhead, EMP missile (mass-stun, no damage).

## 8. LASER BEAM (sustained line)
Hold to fire continuous beam in facing direction. Can't move while firing. 1.5s max. ~5s cooldown.
- **Fantasy**: "Plant your feet and melt a line."
- **Card ideas**: Sweeper (slow rotation), refraction (splits on first hit), element beam, overcharge ramp (1x→3x over duration).

## 9. TETHER (chain to target)
Auto-locks nearest enemy, deals DOT, slows 30%. Breaks at distance or 3s. ~5s cooldown.
- **Fantasy**: "Lock down the dangerous one while kiting."
- **Card ideas**: Multi-tether, element tether, pull enemies toward you, damage transfer between linked enemies.

## Recommended ship order
1. Beacon (exists), Pulse Nova, Discharge — cover deploy/defense/offense
2. Payload, Deadshot — add indirect fire and precision
3. Others as unlockables or character-specific
