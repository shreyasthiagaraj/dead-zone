# Dash System Design Document

## 1. Purpose

This document defines the **dash-only build layer** for the game. It selects the strongest dash ideas from the broader concept pool and turns them into a focused production spec.

The goal is for dash to serve four jobs:

- reposition the player
- create offensive openings
- cash out status setups
- provide limited survivability

Dash should not be just a panic button. In strong builds, it should become a **combat decision with timing, intent, and payoff**.

## 2. Dash design goals

### 2.1 Keep dash readable
The player should understand what their dash does at a glance.

### 2.2 Make dash offensive
A large percentage of strong builds should want to dash *through* or *into* combat situations, not only away from them.

### 2.3 Preserve class identity
Each class should express itself through dash in a distinct way:
- **Thermal** cashes out with ignition and detonation
- **Cryo** sets up freeze and shatter
- **Arc** amplifies chain volatility
- **Pulse** owns movement and impact
- **Corrupt** spreads instability and execute windows

### 2.4 Avoid overload
Dash should have a small number of clearly felt modifiers rather than too many tiny stacked rules.

### 2.5 Reward skill, not spam
Dash should reward timing, pathing, and target selection. Cooldown refund and multi-charge tools should exist, but not to the point that dash becomes mindless spam.

## 3. Core dash framework

Every dash modifier belongs to one of five categories.

### 3.1 Entry effects
Trigger at dash start.

### 3.2 Trail effects
Apply during dash movement.

### 3.3 Exit effects
Trigger at dash endpoint.

### 3.4 Post-dash riders
Buff the next shot or short firing window after dash.

### 3.5 Passive dash modifiers
Change dash rules such as cooldown, safety, charges, or distance.

A strong dash build usually contains:
- one primary dash identity card
- one payoff card
- one safety or consistency card

## 4. Base dash assumptions

These are the default mechanical assumptions this spec builds on.

### 4.1 Base dash
- short directional burst
- brief invulnerability or projectile forgiveness at the start
- cooldown-based
- no default damage

### 4.2 Base player expectation
Without upgrades, dash is mainly a reposition and survival tool.  
With upgrades, dash becomes:
- setup
- payoff
- survivability layer
- class expression layer

## 5. Recommended dash card pool

This is the curated dash pool. It excludes weaker or overly niche ideas.

## 5.1 Universal dash cards

These can appear in any run.

### Shockwave
**Category:** Exit  
**Rarity:** Common  
**Role:** universal offensive dash baseline

**Effect:** Dash endpoint emits a radial impact burst that deals light damage and knocks enemies back.

**Why it belongs:**  
This is the cleanest default offensive dash card. It is readable, useful, and synergizes naturally with Pulse, Cryo, and general crowd control.

**Upgrade path:**
- Level 1: small endpoint impact burst
- Level 2: larger radius and stronger force
- Level 3: enemies hit become briefly **Exposed**

---

### Shield Dash
**Category:** Passive / defense  
**Rarity:** Rare  
**Role:** survivability anchor

**Effect:** Gain a short-lived **Barrier** after dash.

**Why it belongs:**  
The best sustain in this game is shield-like, not heal-like. This is the most elegant defensive dash card.

**Upgrade path:**
- Level 1: gain small Barrier after dash
- Level 2: Barrier duration increased
- Level 3: Barrier gain slightly improves if dash passed through enemies

---

### Predator Round
**Category:** Post-dash rider  
**Rarity:** Rare  
**Role:** universal damage payoff

**Effect:** The first shot after dash deals bonus damage.

**Why it belongs:**  
This makes dash matter even in otherwise simple builds. It also bridges naturally into crit windows and precision play.

**Upgrade path:**
- Level 1: first shot after dash deals bonus damage
- Level 2: first shot gains bonus projectile speed or pierce
- Level 3: first shot also gains crit chance

---

### Extra Charge
**Category:** Passive rule modifier  
**Rarity:** Rare  
**Role:** mobility expansion

**Effect:** Add one extra dash charge.

**Why it belongs:**  
Extra charge is one of the most meaningful structural upgrades in any movement system. It changes how aggressively the player can play without adding complexity.

**Upgrade path:**
- Level 1: +1 dash charge
- Level 2: slightly faster recharge per charge

---

### Tempo Dash
**Category:** Passive rule modifier  
**Rarity:** Rare  
**Role:** aggressive cooldown loop

**Effect:** Each enemy hit by dash effects reduces dash cooldown slightly.

**Why it belongs:**  
This rewards offensive use without becoming free spam. It makes dash builds feel alive and encourages pathing through packs.

**Upgrade path:**
- Level 1: enemies hit by dash effects reduce cooldown slightly
- Level 2: stronger refund cap
- Level 3: refund is improved against elites

## 5.2 Thermal dash cards

Thermal dash should convert movement into ignition and detonation.

### Burnout Wake
**Category:** Trail  
**Rarity:** Common  
**Role:** Thermal setup

**Effect:** Dash trail applies **Overheat** to enemies crossed during dash.

**Why it belongs:**  
This is the cleanest Thermal dash enabler. It turns dash paths into offensive lines and naturally feeds explosion builds.

**Upgrade path:**
- Level 1: trail applies Overheat
- Level 2: trail lingers briefly
- Level 3: trail applies stronger Overheat to already-Overheated enemies

---

### Flashpoint
**Category:** Exit  
**Rarity:** Rare  
**Role:** Thermal cashout

**Effect:** Dash endpoint detonates nearby **Overheated** enemies.

**Why it belongs:**  
This is the best dash-cashout identity for Thermal. It creates a clear loop: apply Overheat, dash in, detonate.

**Upgrade path:**
- Level 1: detonate nearby Overheated enemies
- Level 2: larger detonation radius
- Level 3: detonations spread light Overheat to nearby enemies

---

### Thermal Spike
**Category:** Post-dash rider  
**Rarity:** Rare  
**Role:** single-target or elite setup

**Effect:** The next shot after dash applies heavy **Overheat**.

**Why it belongs:**  
Useful in builds that want dash to set up burst on priority targets rather than just clear swarms.

**Upgrade path:**
- Level 1: next shot applies heavy Overheat
- Level 2: next shot deals bonus damage to Overheated targets
- Level 3: next shot briefly increases Thermal application on subsequent hits

## 5.3 Cryo dash cards

Cryo dash should create lock states and shatter moments.

### Cryo Wake
**Category:** Trail  
**Rarity:** Common  
**Role:** Cryo setup

**Effect:** Dash trail applies **Chill** to enemies crossed during dash.

**Why it belongs:**  
The simplest and most reliable Cryo dash enabler.

**Upgrade path:**
- Level 1: trail applies Chill
- Level 2: trail lingers briefly as a slowing zone
- Level 3: already-Chilled enemies gain extra Chill when touching the trail

---

### Freeze Pulse
**Category:** Exit  
**Rarity:** Common  
**Role:** Cryo area control

**Effect:** Dash endpoint applies **Chill** in a radius.

**Why it belongs:**  
Extremely readable. Useful in both control builds and hybrid shatter builds.

**Upgrade path:**
- Level 1: endpoint applies Chill
- Level 2: extra Chill to already-Chilled enemies
- Level 3: low-health heavily Chilled enemies can become Frozen immediately

---

### Shatter Step
**Category:** Exit  
**Rarity:** Rare  
**Role:** Cryo cashout

**Effect:** **Frozen** enemies near dash endpoint take heavy bonus damage or instantly shatter.

**Why it belongs:**  
This gives Cryo a satisfying dash finisher and prevents the class from being only setup with no aggressive cashout.

**Upgrade path:**
- Level 1: Frozen enemies near dash endpoint take bonus damage
- Level 2: low-health Frozen enemies shatter instantly
- Level 3: shatter creates small splash damage

## 5.4 Arc dash cards

Arc dash should feel like speed, conduction, and burst volatility.

### Static Wake
**Category:** Trail  
**Rarity:** Common  
**Role:** Arc application

**Effect:** Dash trail zaps nearby enemies and lightly applies **Charged**.

**Why it belongs:**  
It is readable and makes dash pathing matter in Arc builds.

**Upgrade path:**
- Level 1: trail emits light zaps
- Level 2: more consistent Charged application
- Level 3: trail zaps prefer Charged enemies and chain farther

---

### Overcharge Dash
**Category:** Post-dash rider  
**Rarity:** Common  
**Role:** Arc tempo payoff

**Effect:** For a short time after dash, Arc proc chance or chain quality is increased.

**Why it belongs:**  
This is the cleanest Arc dash card because it turns movement into electrical tempo without requiring too much visual clutter.

**Upgrade path:**
- Level 1: short Arc-boost window after dash
- Level 2: longer duration
- Level 3: first Arc proc after dash deals bonus chain damage

---

### Discharge Burst
**Category:** Exit  
**Rarity:** Rare  
**Role:** Arc cashout

**Effect:** Dash endpoint releases Arc into nearby **Charged** enemies.

**Why it belongs:**  
This is the best Arc endpoint finisher. It rewards prior setup and pack density.

**Upgrade path:**
- Level 1: endpoint discharges into Charged enemies
- Level 2: increased jump count
- Level 3: discharged enemies briefly spread light Charged nearby

## 5.5 Pulse dash cards

Pulse owns movement, impact, and positional control.

### Impulse Wave
**Category:** Exit  
**Rarity:** Common  
**Role:** core Pulse identity

**Effect:** Dash endpoint emits a large shockwave.

**Why it belongs:**  
This is probably the single most iconic Pulse dash card. It clearly expresses impact and space control.

**Upgrade path:**
- Level 1: large endpoint shockwave
- Level 2: stronger force and larger radius
- Level 3: enemies hit become **Exposed**

---

### Slipstream
**Category:** Passive / post-dash mobility  
**Rarity:** Rare  
**Role:** mobility amplification

**Effect:** Gain move speed briefly after dash.

**Why it belongs:**  
Simple, elegant, and very strong in mobile-feeling movement builds. It pairs naturally with Arc and Pulse.

**Upgrade path:**
- Level 1: brief move-speed gain
- Level 2: slightly longer duration
- Level 3: also grants small projectile-speed or fire-rate bonus

---

### Kinetic Wake
**Category:** Trail  
**Rarity:** Rare  
**Role:** positional trail control

**Effect:** Dash trail pushes enemies aside as the player passes through them.

**Why it belongs:**  
This gives Pulse a distinct trail identity compared with other classes. It shapes packs instead of only damaging them.

**Upgrade path:**
- Level 1: trail pushes enemies aside
- Level 2: stronger displacement
- Level 3: enemies moved by the trail become lightly Exposed

## 5.6 Corrupt dash cards

Corrupt dash should spread instability and create execute windows.

### Glitch Wake
**Category:** Trail  
**Rarity:** Common  
**Role:** Corrupt application

**Effect:** Dash trail applies **Corrupt** stacks.

**Why it belongs:**  
This is the cleanest Corrupt dash enabler and mirrors Burnout Wake / Cryo Wake structurally.

**Upgrade path:**
- Level 1: trail applies Corrupt
- Level 2: trail lingers briefly as a glitch zone
- Level 3: already-Corrupted enemies gain additional stacks when re-entering the zone

---

### Fatal Exception
**Category:** Post-dash rider  
**Rarity:** Rare  
**Role:** Corrupt execute payoff

**Effect:** The next shot after dash deals bonus damage to **Compromised** enemies.

**Why it belongs:**  
This gives Corrupt a crisp “mark then execute” loop and makes dash timing matter on elites.

**Upgrade path:**
- Level 1: next shot deals bonus damage to Compromised enemies
- Level 2: next shot also applies bonus Corrupt
- Level 3: next shot has improved crit chance against Compromised enemies

---

### Collapse Field
**Category:** Exit  
**Rarity:** Rare  
**Role:** instability zone

**Effect:** Dash endpoint creates a brief glitch field that weakens or destabilizes nearby enemies.

**Why it belongs:**  
It gives Corrupt an endpoint identity that is not just raw damage. It also supports elite focus and synergy builds.

**Upgrade path:**
- Level 1: endpoint creates short glitch field
- Level 2: enemies inside gain Corrupt faster
- Level 3: Compromised enemies inside emit small failure pulses

## 6. Synergy dash cards

These are premium dash cards that should usually be **Epic** and require investment in two classes.

### Storm Drive
**Classes:** Arc + Pulse  
**Category:** Post-dash synergy  
**Rarity:** Epic

**Effect:** After dashing, Arc chain chance and range increase briefly.

**Why it belongs:**  
This is the best movement-driven synergy dash card in the whole set. It captures the fantasy of becoming a storm through motion.

**Upgrade path:**
- Level 1: short Arc chain boost after dash
- Level 2: improved range and chain chance
- Level 3: Pulse shockwaves can trigger Arc burst on Charged enemies

---

### Core Breach Dash
**Classes:** Thermal + Corrupt  
**Category:** Exit synergy  
**Rarity:** Epic

**Effect:** **Compromised** and **Overheated** enemies near dash endpoint erupt violently and spread Corrupt.

**Why it belongs:**  
This is an excellent elite-and-pack hybrid payoff. It merges instability and meltdown cleanly.

**Upgrade path:**
- Level 1: Compromised Overheated enemies explode harder
- Level 2: larger radius
- Level 3: spreads Corrupt on eruption

---

### Shatter Wave
**Classes:** Cryo + Pulse  
**Category:** Exit synergy  
**Rarity:** Epic

**Effect:** Dash shockwave instantly shatters low-health **Frozen** enemies.

**Why it belongs:**  
This is the cleanest Cryo-Pulse synergy dash card. It rewards setup, timing, and crowd shaping.

**Upgrade path:**
- Level 1: low-health Frozen enemies shatter from shockwave
- Level 2: shockwave deals bonus damage to Chilled enemies
- Level 3: shatter splash radius increased

---

### Fault Cascade Dash
**Classes:** Arc + Corrupt  
**Category:** Exit / trail synergy  
**Rarity:** Epic

**Effect:** Damaging or crossing **Compromised** enemies during dash causes Arc pulses.

**Why it belongs:**  
This creates a distinctive “network failure” loop and is one of the best advanced payoff cards.

**Upgrade path:**
- Level 1: Compromised enemies affected by dash emit Arc pulse
- Level 2: pulses can apply Charged
- Level 3: pulse radius increased on elites

## 7. Dash offer structure

### Common
Simple, readable, frequently useful:
- Shockwave
- Burnout Wake
- Cryo Wake
- Freeze Pulse
- Static Wake
- Overcharge Dash
- Impulse Wave
- Glitch Wake

### Rare
Stronger payoff, safety, or structural identity:
- Shield Dash
- Predator Round
- Extra Charge
- Tempo Dash
- Flashpoint
- Thermal Spike
- Shatter Step
- Discharge Burst
- Slipstream
- Kinetic Wake
- Fatal Exception
- Collapse Field

### Epic
Cross-class payoff and signature identity:
- Storm Drive
- Core Breach Dash
- Shatter Wave
- Fault Cascade Dash

## 8. Recommended v1 dash package

For launch, I’d ship this exact subset:

### Universal
- Shockwave
- Shield Dash
- Predator Round

### Thermal
- Burnout Wake
- Flashpoint

### Cryo
- Cryo Wake
- Freeze Pulse
- Shatter Step

### Arc
- Static Wake
- Overcharge Dash
- Discharge Burst

### Pulse
- Impulse Wave
- Slipstream

### Corrupt
- Glitch Wake
- Fatal Exception

### Synergy
- Storm Drive
- Shatter Wave

This gives:
- one clear dash identity for each class
- one universal defense tool
- one universal damage rider
- two premium synergy payoffs
- manageable balancing scope

## 9. v2 additions

Once v1 is stable, the best next additions are:

- Extra Charge
- Tempo Dash
- Thermal Spike
- Kinetic Wake
- Collapse Field
- Core Breach Dash
- Fault Cascade Dash

These are strong, but slightly more complex or more balance-sensitive.

## 10. Dash balance guardrails

### 10.1 Dash should not replace shooting
Dash is a payoff and setup layer, not the entire combat loop.

### 10.2 Dash should not become infinite
Cooldown refund and extra charge effects should be capped and carefully tuned.

### 10.3 Defensive dash cards should be strong but not mandatory
Shield Dash should be attractive, not required.

### 10.4 Class dash cards should feel distinct
Trail-heavy cards should not all blur together.

### 10.5 Synergy dash cards should feel premium
Epic dash synergies should be exciting, but they should not make all non-synergy dash builds feel invalid.

## 11. Final recommendation

The best dash system for this game is one where dash creates a **second combat grammar**:

- **Thermal** dashes ignite and detonate.
- **Cryo** dashes freeze and shatter.
- **Arc** dashes charge and discharge.
- **Pulse** dashes reshape the battlefield.
- **Corrupt** dashes spread instability and punish broken targets.

That is enough to make dash feel essential, expressive, and build-defining without overcomplicating the game.
