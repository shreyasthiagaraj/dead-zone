# Cyber Top-Down Shooter  
## Gameplay Build System Design Document

## 1. Purpose

This document defines the full **build system** for a top-down cyber-themed shooter in which the player has two active verbs: **Shoot** and **Dash**. The goal of the build system is to generate high replayability and strong run identity without adding extra action buttons or overwhelming the player with too many overlapping systems.

This spec covers:
- damage classes
- statuses
- shot modifiers
- dash modifiers
- card categories
- card leveling
- rarity
- synergy rules
- crit windows
- sustain mechanics
- reward flow
- build archetypes
- balance guardrails

This document is only about the **gameplay build system**, not narrative, meta-economy, UI mockups, map structure, or enemy roster beyond their interaction with builds.

## 2. Core design philosophy

The player only does two things:
1. **Shoot**
2. **Dash**

Everything else comes from how the run modifies those actions.

Every successful run should answer three questions clearly:
1. What does my shot do?
2. What does my dash do?
3. What happens when they interact?

The build system should create builds that players can describe in one sentence:
- “I’m a Thermal explosion build.”
- “I’m a Cryo shatter build.”
- “My Arc gets stronger every time I dash.”
- “I Corrupt elites, then cash out with post-dash finishers.”

If a player cannot explain their build simply, the system is too muddy.

## 3. Core combat vocabulary

### 3.1 Shoot
The player’s base attack action. Shooting fires projectiles according to the current weapon pattern and applies any owned on-hit effects, statuses, class riders, and post-dash bonuses.

### 3.2 Dash
A short movement burst on cooldown. Dash is both a defensive repositioning tool and an offensive trigger platform for dash modifiers, post-dash shot riders, and mobility synergies.

### 3.3 Build
A build is the collection of cards, modifiers, statuses, and synergies assembled during a single run.

### 3.4 Card
A card is a run-based upgrade selection. Cards are the primary vehicle through which the player modifies shot behavior, dash behavior, class identity, survivability, and cross-class synergies.

### 3.5 Primary class
The class that defines the main damage engine of the run. Most successful runs should have one obvious primary class.

### 3.6 Secondary class
A support class that enhances or combines with the primary class through utility or synergy cards.

### 3.7 Status
A temporary state applied to enemies or the player that changes behavior, vulnerability, movement, or damage interactions.

### 3.8 Proc
A triggered secondary effect, often chance-based or condition-based. Example: an Arc chain firing off on hit.

### 3.9 Shatter
A damage payoff event that happens when a **Frozen** enemy is struck by certain attacks or effects. Shatter usually causes bonus single-target damage and may also cause splash damage.

### 3.10 Barrier
A temporary shield layer that absorbs damage before the player loses Integrity.

### 3.11 Integrity
The player’s main health pool.

### 3.12 Repair
A restoration of lost Integrity. Repair is intentionally limited.

### 3.13 Crit window
A temporary or conditional state in which a specific type of shot gains increased critical-hit chance or guaranteed precision bonus.

### 3.14 Elite
A tougher enemy class intended to function as a pressure spike and reward checkpoint. Elites are often the cleanest source of milestone sustain.

### 3.15 Status force
A hidden or semi-hidden value representing how strongly a hit applies a status. Slow, heavy hits can have more status force than weaker rapid hits.

## 4. Build-system goals

The build system must satisfy the following goals.

### 4.1 Strong identity
Every run should feel different within the first few upgrade choices.

### 4.2 High readability
The player should understand what most upgrades do immediately.

### 4.3 Synergy over bloat
Depth should come from combinations, not from an excessive number of actions.

### 4.4 Mobile-friendly clarity
Effects should be legible in a top-down mobile context and not rely on tiny text or subtle hidden rules.

### 4.5 Controlled randomness
Randomness should create variety, but the player should still be able to steer toward a build.

## 5. Damage-class system

The game uses five cyber-themed damage classes. These are the backbone of build identity.

## 5.1 Thermal

### Fantasy
Overheating systems, combustion, pressure buildup, and meltdown.

### Combat role
Fast pressure, swarm clear, explosive payoff.

### Core status
**Overheat**

### Behavior
Thermal creates immediate offensive pressure. It is strongest against weak and mid-health enemies in packs. It is intended to clear screens through chain explosions, burning spread, and dash-triggered detonation effects.

### Thermal should feel like
- aggressive
- front-loaded
- explosive
- escalating
- crowd-focused

### Thermal should not become
- a slow poison-like DOT
- a boss-killer class stronger than Corrupt
- generic flat damage with orange visuals

## 5.2 Cryo

### Fantasy
Coolant lock, frozen servos, brittle structures, seized systems.

### Combat role
Slow, freeze, control, shatter setup.

### Core statuses
**Chill** and **Frozen**

### Behavior
Cryo controls enemy tempo. Chill slows enemies until a threshold is reached, at which point the enemy becomes Frozen for a brief hard-control window. Frozen enemies can then be shattered for burst payoff.

### Cryo should feel like
- tactical
- defensive
- methodical
- precise
- setup-driven

### Cryo should not become
- just blue damage
- a pure DPS class with no control function
- a permanent-lock loop that trivializes encounters

## 5.3 Arc

### Fantasy
Electrical discharge, chain current, overloaded relays, conductive leaps.

### Combat role
Chain damage, proc loops, rapid-hit payoff.

### Core status
**Charged**

### Behavior
Arc scales with density and hit frequency. Charged enemies act as conduits for chain effects, death discharges, and follow-up electrical behavior. Arc thrives when the player is hitting quickly or hitting many targets.

### Arc should feel like
- reactive
- twitchy
- energetic
- chain-oriented
- tempo-scaling

### Arc should not become
- a copy of Thermal with blue art
- the best single-target answer to everything
- a class that works equally well without density or hit frequency

## 5.4 Pulse

### Fantasy
Kinetic fields, shockwaves, vector force, impulse bursts, movement distortion.

### Combat role
Displacement, dash amplification, positioning control, setup.

### Core status
**Exposed**

### Behavior
Pulse controls space. It pushes, pulls, staggers, and reshapes enemy formations. It is also the class most tightly linked to dash identity. Exposed enemies become easier to punish through impact follow-ups, movement-based hits, or crit-window cards.

### Pulse should feel like
- mobile
- skillful
- expressive
- positional
- dash-centric

### Pulse should not become
- raw DPS without spatial function
- a weak utility class with no payoff
- so strong at displacement that it makes aiming or threat management irrelevant

## 5.5 Corrupt

### Fantasy
Malware infection, code instability, viral spread, glitch collapse, cascading failure.

### Combat role
Attrition, vulnerability, elite deletion, spread-on-failure payoff.

### Core status
**Compromised** after enough Corrupt stacks accumulate.

### Behavior
Corrupt is the slowest of the five classes to fully come online, but it provides high value on durable targets. Corrupt stacks build toward Compromised. Once Compromised, the enemy becomes more vulnerable and may produce instability effects on death or under additional pressure.

### Corrupt should feel like
- invasive
- systemic
- punishing
- elite-focused
- inevitable

### Corrupt should not become
- a slower weaker version of Thermal
- the best crowd class in the game
- pure passive DOT with no tactical payoffs

## 6. Status system

## 6.1 Overheat

### Definition
A short-duration Thermal damage-over-time state.

### Function
Overheat creates immediate pressure and supports Thermal explosions and detonation loops. It should refresh easily but not stack infinitely into absurd DOT scaling.

### Intended use
- fast swarm clear
- detonation setup
- Thermal synergy trigger

## 6.2 Chill

### Definition
A stacking Cryo slow state.

### Function
Each Chill stack reduces movement speed and optionally attack speed. When Chill reaches its threshold, the enemy becomes Frozen.

### Intended use
- tempo control
- safety creation
- freeze setup

## 6.3 Frozen

### Definition
A short hard-control Cryo state reached after sufficient Chill.

### Function
Frozen enemies stop acting for a brief window and become vulnerable to shatter and burst payoffs.

### Intended use
- hard setup for burst
- survival tool
- synergy trigger

## 6.4 Charged

### Definition
An Arc conduit mark.

### Function
Charged enemies are preferred nodes for Arc procs. They can enable chain behavior, death discharges, follow-up zaps, or special synergy outputs.

### Intended use
- chain routing
- Arc consistency
- proc engine setup

## 6.5 Exposed

### Definition
A Pulse vulnerability state.

### Function
Exposed enemies are easier to punish after displacement. They take stronger impact follow-up and can be valid targets for conditional crit cards.

### Intended use
- reward positional skill
- convert Pulse utility into damage
- create crit windows

## 6.6 Compromised

### Definition
A Corrupt threshold state.

### Function
A Compromised enemy has suffered enough Corrupt buildup to enter an unstable failure state. These enemies take increased damage and may trigger glitch events, spread behavior, or synergy outputs.

### Intended use
- elite payoff
- failure cascade setup
- post-dash execute windows

## 7. Shot modifier system

Shot modifiers alter the shape, cadence, and feel of shooting. They are not themselves a class, but they are the skeleton that class effects sit on top of.

## 7.1 Wide Spread
Increases projectile count and widens the firing cone. Good for crowd coverage and Thermal application.

## 7.2 Piercing Shot
Allows a projectile to pass through one or more enemies. Good for Cryo lane control and Corrupt application on durable lines.

## 7.3 Rapid Cycle
Increases fire rate. Strong with Arc, Corrupt stacking, and any on-hit proc engine.

## 7.4 Heavy Caliber
Reduces fire rate but increases per-shot damage and status force. Best for deliberate precision or elite damage.

## 8. Dash modifier system

Dash modifiers create the second half of build identity. Every dash effect falls into one of four buckets.

## 8.1 Entry effects
These happen at dash start.

### Phase Start
Grants brief projectile immunity at dash initiation.

### Kinetic Break
Pushes nearby enemies away when dash begins.

### Static Prime
Briefly applies light Charged to nearby enemies at dash start.

## 8.2 Trail effects
These happen during dash movement.

### Burnout Wake
Dash trail applies Overheat.

### Cryo Wake
Dash trail applies Chill.

### Static Wake
Dash trail emits Arc zaps to nearby targets.

### Kinetic Wake
Dash trail pushes enemies aside.

### Glitch Wake
Dash trail applies Corrupt stacks.

## 8.3 Exit effects
These happen at the dash endpoint.

### Shockwave
A radial impact burst at dash end.

### Freeze Pulse
Applies Chill in an area at dash end.

### Flashpoint
Detonates nearby Overheated enemies at dash end.

### Discharge Burst
Fires Arc from the endpoint into nearby Charged targets.

### Collapse Field
A brief pull or glitch instability field at dash end.

## 8.4 Post-dash riders
These affect the next shot or the next few shots after dash.

### Predator Round
The first shot after dash deals bonus damage.

### Thermal Spike
The next shot applies heavy Overheat.

### Overcharge Dash
The next short firing window has improved Arc proc chance.

### Shatter Round
The next shot against a Frozen enemy gets enhanced payoff.

### Fatal Exception
The next shot against a Compromised enemy deals bonus damage.

## 9. Card system

Cards are the core run-progression mechanism.

## 9.1 Card categories

### Class application cards
These introduce a class to shooting or dashing.

Examples:
- Thermal Rounds
- Cryo Rounds
- Arc Rounds
- Pulse Shot
- Viral Payload

### Class enhancement cards
These strengthen an existing class engine.

Examples:
- Reactor Bloom
- Cold Snap
- Chain Conduit
- Vector Snap
- Compromised Core

### Dash cards
These directly modify dash.

Examples:
- Shockwave
- Burnout Wake
- Freeze Pulse
- Shield Dash
- Impulse Wave

### Synergy cards
These require investment in two classes and create cross-class reactions.

Examples:
- Overload
- Thermal Shock
- Conductive Freeze
- Storm Drive
- Fault Cascade

### Generic weapon cards
These alter shot form or cadence.

Examples:
- Wide Spread
- Piercing Shot
- Rapid Cycle
- Heavy Caliber

### Crit cards
These create limited conditional precision windows.

Examples:
- Precision Breach
- Shatterpoint

### Sustain cards
These support survival without enabling infinite healing loops.

Examples:
- Shield Dash
- Recovery Loop
- Emergency Buffer
- Fail Safe

## 10. Card leveling system

Most cards have levels. Cards should generally cap at **2 or 3 levels**. The system should avoid long upgrade ladders that create text bloat.

## 10.1 Leveling rules

### Level 1
Introduces the mechanic.

### Level 2
Strengthens or broadens the mechanic.

### Level 3
Adds a meaningful payoff rider or transforms the mechanic into a more complete engine.

A card should not require level 3 before it feels usable.

## 10.2 Example leveling model

### Thermal Rounds
- Level 1: shots apply Overheat
- Level 2: Overheated enemies explode on death
- Level 3: explosions spread Overheat

### Cryo Rounds
- Level 1: shots apply Chill
- Level 2: Chill reaches Frozen faster
- Level 3: Frozen enemies shatter on kill

### Arc Rounds
- Level 1: shots can apply Charged
- Level 2: Charged targets are more likely to chain
- Level 3: Charged enemies discharge on death

### Pulse Shot
- Level 1: shots apply knockback and Exposed
- Level 2: stronger knockback
- Level 3: hitting Exposed enemies creates mini impact pulses

### Viral Payload
- Level 1: shots apply Corrupt
- Level 2: Compromised enemies take bonus damage
- Level 3: Compromised enemies spread Corrupt on death

## 11. Rarity system

## 11.1 Common
Foundational build pieces. These should be readable and generally usable in many runs.

## 11.2 Rare
Stronger enhancers, better dash tools, crit windows, sustain tools, or class-specific escalation cards.

## 11.3 Epic
Transformative synergy cards and high-leverage sustain or payoff cards.

## 11.4 Legendary
Optional late-stage design space. Should be limited and not required for core depth.

## 12. Full card definitions

## 12.1 Generic cards

### Wide Spread
Increases projectile count and widens the firing cone. Best for crowd coverage and broad status application.

### Piercing Shot
Allows projectiles to pass through targets. Best for hitting enemy lines and improving density scaling.

### Rapid Cycle
Increases fire rate. Good for Arc builds and stack-based application builds.

### Heavy Caliber
Reduces fire rate but increases damage and status force per hit. Good for precise or elite-focused builds.

### Shockwave
Creates a radial impact burst at dash endpoint. A simple universal dash payoff.

### Shield Dash
Grants Barrier after dash for a short duration. A core survivability card.

### Predator Round
The first shot after dash deals bonus damage. Can later gain pierce or crit.

### Precision Breach
Shots against Exposed enemies gain increased crit chance. Converts Pulse setup into precision payoff.

### Shatterpoint
Shots against Frozen enemies gain a strong crit window. Converts Cryo control into burst damage.

### Recovery Loop
Elite kills restore a small amount of Integrity. Milestone-based sustain.

### Emergency Buffer
When the player drops below a low Integrity threshold, they gain Barrier. Panic-defense sustain.

### Fail Safe
Prevents lethal damage once per run or stage, leaving the player at minimal Integrity with some Barrier.

## 12.2 Thermal cards

### Thermal Rounds
Shots apply Overheat on hit. Core Thermal entry card.

### Reactor Bloom
Overheated enemies explode on death. Strengthens crowd clear.

### Burnout Wake
Dash trail applies Overheat.

### Flashpoint
Dash endpoint detonates nearby Overheated enemies. Converts Thermal into a dash-cashout build.

### Incendiary Feed
Increases the rate or consistency of Thermal application.

### Heat Sink Bypass
Improves Thermal performance against healthy targets.

### Thermal Spike
Next shot after dash applies heavy Overheat.

### Reactor Stress
Overheated elites take bonus damage.

### Wildfire Protocol
Thermal explosions have increased radius or spreading behavior.

## 12.3 Cryo cards

### Cryo Rounds
Shots apply Chill on hit. Core Cryo entry card.

### Cold Snap
Increases Chill strength and improves freeze setup.

### Freeze Pulse
Dash endpoint applies Chill in an area.

### Shatter Drive
Damaging Frozen enemies causes shard burst payoff.

### Coolant Leak
Cryo-affected enemies leave a slowing patch on death.

### Brittle Frame
Frozen enemies take bonus damage.

### Cryo Wake
Dash trail applies Chill.

### Lock Cycle
Frozen lasts longer or triggers more reliably.

### Seized Motors
Chilled enemies attack more slowly.

### Fracture Logic
Shattering a Frozen enemy damages nearby enemies.

## 12.4 Arc cards

### Arc Rounds
Hits have a chance to apply Charged. Core Arc entry card.

### Static Chain
Arc procs jump to nearby enemies. Core chain card.

### Overcharge Dash
After dash, Arc proc chance or Arc chain effectiveness increases briefly.

### Chain Conduit
Arc prefers Charged targets and chains more reliably.

### Capacitor Burst
Charged enemies discharge Arc on death.

### Static Wake
Dash trail zaps nearby targets.

### Conduction Grid
Improves Arc targeting consistency and chain routing.

### Short Circuit
Repeated hits on one target trigger Arc burst damage.

### Volt Return
Arc chains can loop back to the original target.

### Feedback Loop
Arc procs reduce dash cooldown slightly.

## 12.5 Pulse cards

### Pulse Shot
Shots apply knockback and Exposed. Core Pulse entry card.

### Impulse Wave
Dash endpoint emits a large shockwave.

### Slipstream
The player gains move speed after dash and optionally minor projectile-speed or fire-rate bonuses.

### Vector Snap
Shots against Exposed enemies deal bonus impact damage.

### Kinetic Wake
Dash trail pushes enemies aside.

### Pressure Break
Exposed enemies take extra impact damage.

### Drift Lock
Enemies moved by Pulse are slowed briefly.

### Compression Field
Pulse shockwaves pull enemies inward slightly before pushing them out.

### Motion Feed
Pulse effects become stronger while the player is moving.

## 12.6 Corrupt cards

### Viral Payload
Shots apply Corrupt stacks. Core Corrupt entry card.

### Compromised Core
Makes it easier to reach Compromised or extends its duration.

### Cascade Failure
Compromised enemies spread Corrupt on death.

### Fatal Exception
The next shot after dash deals bonus damage to Compromised enemies.

### Memory Leak
Extends Corrupt duration.

### Glitch Wake
Dash trail applies Corrupt.

### Signal Rot
Compromised enemies emit glitch pulses periodically.

### Kernel Panic
Compromised enemies behave erratically or deal reduced damage.

### Deep Infection
Corrupt stacks build faster on elites.

### Leak Field
Compromised enemy death creates a damaging glitch zone.

## 13. Synergy system

Synergies are premium cards that activate only when the player has invested in two compatible classes.

## 13.1 Overload
**Thermal + Arc**

Overheated Charged enemies discharge Arc when hit again.  
Purpose: transform unstable states into pack-clearing burst chains.

## 13.2 Thermal Shock
**Thermal + Cryo**

Thermal damage against Frozen enemies causes a violent burst, usually AoE.  
Purpose: reward temperature-contrast sequencing.

## 13.3 Conductive Freeze
**Cryo + Arc**

Arc chains travel farther or better through Chilled or Frozen enemies.  
Purpose: turn control into chain amplification.

## 13.4 Storm Drive
**Arc + Pulse**

After dashing, Arc chain chance or range increases briefly.  
Purpose: create a fast movement-driven storm build.

## 13.5 Fault Cascade
**Arc + Corrupt**

Compromised enemies emit Arc pulses when damaged.  
Purpose: create network-failure behavior across dense packs.

## 13.6 Core Breach
**Thermal + Corrupt**

Compromised Overheated enemies explode more violently and can spread Corrupt.  
Purpose: merge elite instability with detonation payoff.

## 13.7 Brittle Drift
**Cryo + Pulse**

Pulse effects deal bonus damage to Chilled enemies and may trigger shatter behavior.  
Purpose: reward displacement against brittle targets.

## 13.8 Signal Tear
**Pulse + Corrupt**

Pulse impacts spread Corrupt from unstable targets.  
Purpose: make repositioning part of the infection engine.

## 13.9 Deadlock
**Cryo + Corrupt**

Compromised Chilled enemies slow harder and freeze faster.  
Purpose: combine code failure and mechanical lockup.

## 14. Crit system

A universal crit-stat economy is intentionally excluded. Generic crit stacking would flatten build diversity and compete too directly with the class system.

Crit exists only as **conditional precision windows**.

## 14.1 Approved crit usage
- attacks against Exposed enemies
- attacks against Frozen enemies
- first shot after dash
- rare execution-style effects against vulnerable Compromised enemies

## 14.2 Approved crit cards

### Precision Breach
Shots against Exposed enemies gain crit chance.

### Shatterpoint
Shots against Frozen enemies gain a strong crit window.

### Predator Round
Can gain crit as an advanced version of the first-shot-after-dash payoff.

## 14.3 Crit guardrail
Crit should never become the universally best answer to scaling damage. It must remain a tactical payoff tied to setup.

## 15. Sustain system

The build system avoids broad regeneration and lifesteal. Sustain should preserve tension rather than erase it.

## 15.1 Approved sustain forms
- Barrier generation
- small Integrity repair on elite kill
- emergency defensive triggers
- once-per-run or once-per-stage fail-safe

## 15.2 Sustain cards

### Shield Dash
Gain Barrier after dash.

### Recovery Loop
Restore a small amount of Integrity on elite kill.

### Emergency Buffer
Gain Barrier when falling below a low Integrity threshold.

### Fail Safe
Survive lethal damage once with minimal Integrity and some Barrier.

## 15.3 Sustain guardrail
Continuous healing on hit, passive regen, or lifesteal should not be core build lanes.

## 16. Reward flow and offer rules

## 16.1 Offer cadence
A class-enabling card should appear early. The player should usually receive their first class identity within the first two rewards.

## 16.2 Build targets per run
A strong run should usually end with:
- one primary class
- one secondary class
- one main dash identity
- one or two shot-shape modifiers
- one or two synergy cards
- two to four support cards

## 16.3 Offer weighting
Once a player has committed to a class, that class should appear somewhat more often, but not so often that the run becomes deterministic.

## 17. Build archetypes

## 17.1 Thermal Bomber
Core cards: Thermal Rounds, Reactor Bloom, Burnout Wake, Flashpoint  
Identity: dash into or through packs, trigger explosions, snowball room clear.

## 17.2 Cryo Control
Core cards: Cryo Rounds, Cold Snap, Freeze Pulse, Shatter Drive  
Identity: slow, lock, then shatter enemies in safe windows.

## 17.3 Arc Runner
Core cards: Arc Rounds, Static Chain, Overcharge Dash, Chain Conduit  
Identity: constant movement, rapid hits, chaining electricity.

## 17.4 Pulse Skirmisher
Core cards: Pulse Shot, Impulse Wave, Slipstream, Vector Snap, Precision Breach  
Identity: reposition enemies, create Exposed windows, punish with movement skill.

## 17.5 Corrupt Executioner
Core cards: Viral Payload, Compromised Core, Cascade Failure, Fatal Exception  
Identity: stack instability on elites, then cash out.

## 17.6 Cryo-Pulse Shatter Build
Core cards: Cryo Rounds, Freeze Pulse, Impulse Wave, Brittle Drift, Shatterpoint  
Identity: freeze enemies, manipulate them, then crack them for burst payoff.

## 17.7 Arc-Corrupt Network Build
Core cards: Arc Rounds, Viral Payload, Fault Cascade, Chain Conduit  
Identity: spread instability across clustered enemies like a failing network.

## 18. Balance guardrails

These rules are critical.

### 18.1 Thermal
Must stay best against swarms, not bosses.

### 18.2 Corrupt
Must stay best against durable enemies, not become the best room-clear tool.

### 18.3 Cryo
Must preserve control identity first and damage second.

### 18.4 Arc
Must scale with density and frequency, not just flat stat stacking.

### 18.5 Pulse
Must remain the class most tied to dash expression and spatial manipulation.

### 18.6 Crit
Must stay conditional.

### 18.7 Sustain
Must stay mostly Barrier-based and milestone-based, not passive or infinite.

### 18.8 Synergies
Must be strong and exciting, but not stronger than every coherent single-class engine by default.

## 19. Recommended v1 content pool

The following is the most efficient launch pool for proving the build system.

### Core class cards
- Thermal Rounds
- Reactor Bloom
- Burnout Wake
- Cryo Rounds
- Freeze Pulse
- Shatter Drive
- Arc Rounds
- Static Chain
- Overcharge Dash
- Pulse Shot
- Impulse Wave
- Slipstream
- Viral Payload
- Compromised Core
- Cascade Failure

### Generic cards
- Shockwave
- Shield Dash
- Predator Round
- Wide Spread
- Piercing Shot
- Precision Breach
- Recovery Loop

### Synergies
- Overload
- Thermal Shock
- Conductive Freeze
- Storm Drive
- Fault Cascade

This pool is large enough to create real build variety while still being small enough to balance cleanly.

## 20. Final design summary

This build system is designed to produce depth through **interaction**, not through extra buttons. The player always shoots and dashes. The build system transforms those two verbs into many distinct playstyles by layering classes, statuses, shot modifiers, dash modifiers, controlled crit windows, limited sustain tools, and synergy cards.

The identity of the five classes is:

- **Thermal**: fast pressure and explosions
- **Cryo**: slow, freeze, shatter
- **Arc**: charge, chain, discharge
- **Pulse**: impact, movement, positioning
- **Corrupt**: stacks, vulnerability, failure from within

That gives the game a clean grammar for builds and a large design space for expansion without losing clarity.
