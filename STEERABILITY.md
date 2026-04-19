# NECROWAVE: Run Steerability System

---

## 1. Thesis

**NECROWAVE is about the journey from chaos to mastery.** Section 1 feels impossible — underpowered, surrounded, barely surviving. By section 20, you've built a combat engine that dissolves rooms. By section 40, you're expressing a complete build against the game's hardest challenges. That arc — helpless to godlike — is the product.

Steerability amplifies that arc by making the player **author it**. Instead of passively receiving a shop every 2 sections, they make constant micro-decisions: "Do I heal to survive this moment, or take the card that completes my engine?" Those decisions create ownership. The power fantasy isn't just "I'm strong" — it's "I chose to be strong in this specific way, and I earned it."

Why players replay NECROWAVE:

- **The build discovery**: "Last run I went Thermal explosion. This time I'm trying Cryo-shatter."
- **The survival narrative**: "I almost died at section 14, took healing over a card, barely made it to the boss, and then my Reforge turned it all around."
- **The mastery expression**: "I know these enemies now. I know what my build needs. Let me execute."

Steerability serves all three.

---

## 2. The Problem

Right now, the mod terminal appears every 2 sections on a fixed clock. The player always gets 3 cards. There are no other meaningful decision points between sections. This means:

- **Every run has the same rhythm.** Combat → shop → combat → shop. No variation.
- **No resource tension.** You always get a shop whether you need one or not.
- **No risk/reward.** You can't opt into harder content for better returns.
- **No survival vs. growth tradeoff.** You can't sacrifice a shop for healing when you're at 15 HP.
- **Runs lack identity.** Two players with the same class often have similar-feeling runs.

The enemy design document says the enemy system should make the build system feel **necessary, not decorative**. Right now, the build system is on autopilot — the player just picks the best of 3 cards every 2 sections. There's no cost to building, no sacrifice, no authorship.

---

## 3. The Solution: Data Link Choice System

After clearing a section (on the existing shop cadence — every 2 sections), instead of a guaranteed mod terminal, the player sees **two Data Links** — a choice between two different reward types.

The next section's enemies are always the same regardless of choice (preserving the carefully designed difficulty curve). The choice is purely about **what you receive**.

This is the Hades model: you're not choosing your difficulty, you're choosing your reward. But because rewards compete with each other, every choice creates tension.

**Core flow:**

```
Clear section → Data Link choice appears (2 options) → Player taps one
→ Reward delivered → Door opens → Next section
```

---

## 4. Reward Types

Five core types. Each is distinct, situationally valuable, and competes with the others.

### MOD (Cyan glow — chip icon)

- **What:** Mod terminal opens. 3 cards, class-weighted (existing system).
- **When it's valuable:** Always. This is how you build your engine.
- **Tension:** "I need this card, but I'm at 30 HP..."
- **Frequency:** Most common option (~55% of choices include this).

### REPAIR (Green glow — cross icon)

- **What:** Restore 30 HP. If at full HP, gain 15 barrier instead.
- **When it's valuable:** Low HP. The barrier fallback prevents it from being dead at full health.
- **Tension:** "I could heal now, or I could take the card and hope I survive."
- **Frequency:** Common (~35% of choices), biased higher when HP is low.

### REFORGE (Orange glow — anvil icon)

- **What:** Opens a panel showing all current cards. Pick one to upgrade by +1 level. Shows what the next level does.
- **When it's valuable:** Mid-to-late run when you have good cards worth upgrading. Equivalent to a Hades Pom of Power.
- **Tension:** "Do I deepen my existing build or get a new card?"
- **Availability:** Only appears if the player has 2+ upgradeable cards (cards below max level).
- **Frequency:** Moderate (~25% of choices when eligible).

### BITS (Gold glow — hexagon icon)

- **What:** 20-50 bits (scales with section depth: `15 + section * 0.7`). Meta-currency for the Forge between runs.
- **When it's valuable:** When investing in long-term progression, or saving for an expensive mod terminal purchase.
- **Tension:** "My build is good enough for now — do I bank bits for the Forge, or keep pushing power?"
- **Frequency:** Moderate (~25% of choices).

### TRIAL (Red glow — skull icon)

- **What:** Adds a modifier to the next section: all enemies get +30% HP, +20% speed, and one bonus elite spawns. After clearing, you receive a **guaranteed rare+ card** (separate bonus pick, doesn't replace your next regular choice).
- **When it's valuable:** When your build is strong and you're confident. Pure greed play.
- **Tension:** "My build can handle this... probably. Is the rare card worth the risk?"
- **Availability:** Only appears after section 5 (player needs a few cards first).
- **Frequency:** Uncommon (~15% of choices when eligible). Appears more often when build is strong.

---

## 5. Choice Generation Rules

### Drawing Algorithm

Each choice shows exactly 2 options drawn from a weighted pool without replacement.

| Type    | Base Weight | Condition                              |
| ------- | ----------- | -------------------------------------- |
| MOD     | 55          | Always eligible                        |
| REPAIR  | 30          | Always eligible (barrier fallback)     |
| REFORGE | 25          | Only if player has 2+ upgradeable cards |
| BITS    | 20          | Always eligible                        |
| TRIAL   | 12          | Only after section 5                   |

### Hard Rules

- **No duplicates:** Both options are always different types.
- **No dead choices:** At least one option must advance the build (MOD or REFORGE). If the draw produces REPAIR + BITS, reroll one.
- **Guaranteed first MOD:** The first choice (section 2) always includes MOD as one option. This teaches the system and ensures the player gets their first card opportunity.
- **Drought protection:** If MOD hasn't appeared in 3 consecutive choices, force-include it next time.

---

## 6. Adaptive Weighting

Player state modifies the base weights to create contextually appropriate choices. The goal: the player should almost always face a genuine dilemma, not an obvious pick.

| Condition              | Weight Change        | Rationale                                  |
| ---------------------- | -------------------- | ------------------------------------------ |
| HP < 50%               | REPAIR +25           | Healing becomes urgent                     |
| HP < 30%               | REPAIR +40 (total)   | Survival is critical                       |
| HP > 90%               | REPAIR -15           | Healing is low-value                       |
| No class cards yet     | MOD +20              | Player needs to start building             |
| 3+ cards in one class  | REFORGE +15          | Good targets to upgrade                    |
| 5+ total cards         | TRIAL +10            | Build can handle challenge                 |
| After boss kill        | REFORGE +20          | Upgrade celebration                        |
| Section 30+            | BITS -10             | Late game should focus on in-run power     |
| Last choice was MOD    | MOD -15              | Variety                                    |
| Last choice was REPAIR | REPAIR -20           | Don't let player chain-heal                |

This prevents: always seeing the same two options, never getting what you need, or choices being too obvious.

---

## 7. Cadence & Pacing

### Regular Choices

Every 2 cleared sections, matching the current shop cadence (`SHOP_SECTION_INTERVAL = 2`). This gives ~25 choice points across 50 sections.

### Fixed Rewards (no choice — automatic)

- **Boss kill (sections 6, 11, 16, 21, 26, 31, 36, 41, 46):** Guaranteed rare+ card pick (3 cards, all rare or better). This is a BONUS — the next regular choice still happens on schedule.
- **Domain transition (sections 10, 20, 30, 40):** "DOMAIN GIFT" — choice of one card from ANY class, guaranteed rare+. Also a bonus.

### Rhythm per Domain (10 sections)

```
Sec 0: Combat
Sec 1: Combat → CHOICE
Sec 2: Combat
Sec 3: Combat → CHOICE
Sec 4: Combat
Sec 5: Combat → CHOICE
Sec 6: BOSS → Boss Reward (guaranteed rare card)
Sec 7: Combat → CHOICE
Sec 8: Combat
Sec 9: Combat → CHOICE + Domain Gift
```

That's **5 choices + 1 boss reward + 1 domain gift = 7 decision/reward points per domain.** Over 50 sections: ~25 choices + ~5 boss rewards + ~4 domain gifts = **~34 meaningful moments.** One every ~25 seconds in a 15-minute run.

Frequent enough to feel agentic, spaced enough to avoid decision fatigue.

---

## 8. UI/UX Design (Mobile-First)

### Choice Overlay

When a choice triggers, after a 0.5s beat (let the player breathe after combat):

1. **Two panels slide up from bottom**, side by side, each taking ~45% of screen width.
2. Each panel shows:
   - **Large icon** (color-coded glow): 48px, centered
   - **Label**: 1-2 words, 16px bold ("MOD", "REPAIR", "REFORGE", "BITS", "TRIAL")
   - **Brief description**: 1 line, 10px dim text ("3 cards, class-weighted", "Restore 30 HP", etc.)
3. **Tap one** → selected panel pulses bright, unselected fades → 0.3s transition → reward delivered.

**Design time target: <3 seconds** from appearance to decision. The panels are large, the icons are clear, the labels are short. No scrolling, no complexity.

### Thematic Framing

- Header text: `// DATA ROUTING //` in glitch font
- Panels have thin neon borders matching reward color
- Background dims slightly during choice (combat is over, this is a decision moment)
- Selection SFX: crisp digital "route confirmed" sound

### TRIAL Visual

When TRIAL is active on a section:

- Section title card shows `// TRIAL: OVERCLOCKED //` in red
- Subtle red vein overlay on section walls
- Enemies have a faint red highlight
- After clearing: "TRIAL COMPLETE" callout → bonus card terminal appears

### REFORGE UI

- Opens a scrollable panel of all current cards (similar to Equipped Mods view)
- Each card shows: name, current level, max level, "NEXT:" preview of what +1 level does
- Maxed cards are dimmed and unpickable
- Tap a card → upgrade animation (card glows, level number ticks up, brief particle burst)

---

## 9. Economy Rebalance

The choice system changes the economy. Here's what shifts and how to compensate.

### Card Acquisition Rate

- **Before:** ~25 shop visits (every 2 sections, guaranteed)
- **After:** ~15 MOD choices + ~5 boss/domain cards + ~3 REFORGE = ~23 card events
- **Net change:** Roughly the same total card power, but the player CHOSE when to take cards vs. other rewards. Runs where you take lots of healing will have fewer cards — that's intentional. You survived, but your build is weaker. Tension.

### Bits Economy

- **Before:** Bits earned only through kills and run-end bonuses.
- **After:** BITS is also a choice reward (20-50 per pick). Expect ~3-5 BITS picks per run = 60-250 extra bits.
- **Impact:** Forge progression is ~30% faster for players who sometimes choose BITS. This is fine — it rewards long-term thinking.

### Health Economy

- **Before:** Health drops from kills (~25% chance), Recovery Loop on elite kills, Emergency Buffer.
- **After:** REPAIR is a choice reward (30 HP or 15 barrier). Random health drops remain unchanged.
- **Key:** REPAIR is a CHOICE, not free. Taking REPAIR means NOT taking a card. This creates real cost to healing, which makes sustain cards (Recovery Loop, Emergency Buffer, Fail Safe) more valuable. Players who invest in sustain cards can skip REPAIR and take more MODs. Players who skip sustain cards need REPAIR more often. **Sustain cards now have strategic value beyond their direct effect.**

---

## 10. Complementary Systems (Recommended Additions)

These aren't required for v1 but would significantly enhance steerability.

### 10a. Data Protocol (Pre-Run Class Bias)

In the Shell, before starting a run, the player can select a **Data Protocol** — a starting bias that guarantees their first MOD choice includes a card from a specific class.

- Thermal Protocol: first MOD includes a Thermal card
- Cryo Protocol: first MOD includes a Cryo card
- Arc Protocol: first MOD includes an Arc card
- Pulse Protocol: first MOD includes a Pulse card
- Corrupt Protocol: first MOD includes a Corrupt card

This lets the player START steering before the run begins. Equivalent to Hades' Keepsake system. Unlocked through Forge progression (spend bits to unlock each protocol).

### 10b. Corruption Pact (Run Modifiers)

Optional difficulty modifiers selected in the Shell. Each modifier makes the run harder but improves rewards:

| Modifier       | Effect               | Reward                                 |
| -------------- | -------------------- | -------------------------------------- |
| HARDENED MESH  | Enemies +20% HP      | All MOD choices include 1 rare+        |
| SIGNAL DECAY   | No health drops      | REPAIR restores 50 HP instead of 30    |
| OVERCLOCKED    | Enemies +15% speed   | +30% bits earned                       |
| STRIPPED        | Start with 75 HP     | Boss rewards include 1 epic card       |

Stack multiple modifiers for compounding benefits. This is the Hades Pact of Punishment model — endgame players add difficulty for themselves because they WANT the challenge and the rewards.

### 10c. Class Mastery Bonuses

When a player accumulates 3+ cards from one class, they unlock a passive Class Mastery bonus:

| Class   | 3-Card Mastery                     | 5-Card Mastery                                 |
| ------- | ---------------------------------- | ---------------------------------------------- |
| Thermal | Overheat ticks 20% faster          | Overheated enemies always explode on death      |
| Cryo    | Chill stacks apply 25% faster      | Frozen enemies shatter to nearby targets        |
| Arc     | Chain range +25%                   | Charged discharge hits +2 targets               |
| Pulse   | Knockback force +30%               | Exposed enemies take 2x crit damage             |
| Corrupt | Corrupt threshold -1 stack         | Compromised enemies die at 10% HP               |

This creates a depth-vs-breadth tradeoff: going deep into one class gets mastery bonuses, going wide across classes enables synergy cards. The player must choose. REFORGE becomes even more interesting — do you upgrade within your mastery class, or diversify?

---

## 11. What's Missing / Additional Considerations

### 11a. Card Limit

With ~15 MOD picks plus boss/domain cards, a player could have 20+ cards by section 40. That's a lot of simultaneous effects. Consider:

- **Soft limit:** After 12 cards, new MOD picks offer "REPLACE" option — swap an existing card for the new one (removed card is gone). This creates pruning decisions.
- **Or:** No limit, but late-game MOD choices naturally shift to REFORGE (upgrading existing cards is better than adding marginal new ones).

Recommend no hard limit for v1. The natural cadence (~15 MOD picks) keeps build size manageable. If testing reveals bloat, add the replace mechanic.

### 11b. Card Removal

A sixth reward type could be **PURGE** — remove a card from your build. Useful for: removing an early card that no longer fits, correcting a mistake, or making room under a card limit. This is a v2 feature — only valuable once players are experienced enough to know what to remove.

### 11c. Multiplayer

For v1, choices are **host-only** in multiplayer (consistent with the host-authoritative model). Non-host players see the host's choice. In v2, each player could get individual choices (rewards are per-player, but enemies are shared).

### 11d. Narrative Integration

The game has memory fragments and domain shifts. A future reward type could be **SIGNAL ECHO** — a narrative fragment that also grants a small permanent buff (+5 max HP, +3% move speed). This makes engaging with the story a strategic choice. Shelve for v2.

### 11e. Data Cache Item System

IDEAS.md already describes a consumable item system (Repair Kit, EMP Pulse, Phase Shift, etc.). When implemented, DATA CACHE could become a 6th reward type — receive a consumable item instead of a card/heal/bits. This slots naturally into the choice system. Items would create moment-to-moment tactical choices ("do I use my EMP now or save it for the boss?") complementing the choice system's section-to-section strategic choices.

### 11f. Information Revelation

Should the player know what enemies are in the NEXT section before choosing?

- **Arguments for:** More informed decisions.
- **Arguments against:** Reduces surprise, adds UI complexity.

**Recommendation: No.** Let the player learn through experience which domains have which enemies. The adaptive weighting (low HP → REPAIR more likely) already serves the "help the struggling player" role. Revealing enemies would make choices more analytical and less instinctive — wrong vibe for a fast-paced mobile game.

### 11g. Power-Up Interaction

Power-ups (Rage, Shield, Magnet, Freeze, class bombs) currently drop randomly from enemies. Keep this system as-is — it provides moment-to-moment excitement during combat. The choice system operates at a different timescale (between sections). They complement each other without overlapping.

---

## 12. Evaluation

### Against Room Choice Spec Success Criteria

| Criterion                                      | How This Addresses It                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Every run produces a viable build               | MOD appears in ~55% of choices + drought protection + boss/domain guaranteed cards            |
| No dead runs from RNG                           | Adaptive weighting prevents bad options; guarantees ensure early cards                        |
| Player decisions meaningfully affect outcome    | MOD vs REPAIR vs REFORGE fundamentally changes build trajectory                              |
| Session feels fast, replayable, skill-driven    | <3s decision time, choices create run variety, no decision paralysis                         |

### Against Enemy Design Document Power Arc

| Phase                   | How Steerability Serves It                                                    |
| ----------------------- | ----------------------------------------------------------------------------- |
| Oppression (early)      | Player faces MOD vs REPAIR — "do I build or survive?" Creates urgency         |
| Stabilization (mid)     | REFORGE appears — player can deepen the card that stabilized them             |
| Power Expression (late) | TRIAL appears — player can test their build for bonus rewards                 |
| Stress Test (endgame)   | Build is the product of 25 deliberate choices, not random luck                |

---

## 13. Implementation Sketch

### What Changes

1. **Replace `shouldSpawnShopChest()`** with `shouldShowDataLink()` — same cadence (every 2 sections).
2. **New `generateDataLinkChoice()`** — draws 2 reward types from weighted pool with adaptive modifiers.
3. **New UI overlay** — two-panel choice screen (slides up from bottom, tap to select).
4. **New `deliverReward(type)`** — dispatches to existing shop system (MOD), new heal logic (REPAIR), new reforge UI (REFORGE), bits grant (BITS), or section modifier (TRIAL).
5. **New Reforge UI** — card list with upgrade preview, similar to Equipped Mods panel.
6. **Trial modifier system** — flag on next section that buffs enemies, triggers bonus card on clear.
7. **Boss/domain fixed rewards** — guaranteed rare card terminal after boss, domain gift at transitions.

### What Stays the Same

- Enemy composition and scaling (untouched)
- Card pool and shop logic (MOD choice opens existing shop)
- Bits economy (BITS reward adds to existing flow)
- Health drops from enemies (unchanged)
- Power-up system (unchanged)
- Dash and shooting mechanics (unchanged)

### Rough Size

- Choice generation + weighting: ~80 lines
- Choice UI overlay: ~100 lines
- Reforge UI: ~80 lines
- Trial modifier system: ~40 lines
- Boss/domain rewards: ~30 lines
- Wiring into existing section-clear flow: ~30 lines
- **Total: ~360 lines of new code**, replacing ~30 lines of shop-spawning logic.

---

## Summary

This system turns every 2 sections from "here's a shop" into "what does my run need right now?" That single question — repeated 25 times across a run — is what transforms a linear power ramp into a player-authored story. The build system stops being something that happens TO the player and becomes something they BUILD, deliberately, under pressure, with real tradeoffs.
