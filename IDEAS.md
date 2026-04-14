# IDEAS

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
