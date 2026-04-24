#!/usr/bin/env node
// Generate tier-1 game sound effects via ElevenLabs Sound Effects API.
// Usage:
//   ELEVENLABS_API_KEY=your_key node generate-sounds.js
//   ELEVENLABS_API_KEY=your_key FORCE=1 node generate-sounds.js   # overwrite existing
//   ELEVENLABS_API_KEY=your_key ONLY=pistol_fire,dash node generate-sounds.js  # subset

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Error: Set ELEVENLABS_API_KEY environment variable.');
  process.exit(1);
}

const FORCE = process.env.FORCE === '1';
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map(s => s.trim())) : null;
const SOUNDS_DIR = path.join(__dirname, 'sounds');

// ElevenLabs sound-generation API minimum duration is 0.5s.
// Each entry: [filename, prompt, duration_seconds, prompt_influence]
const SOUND_DEFS = [
  // ============ A. WEAPONS — FIRING ============
  ['pistol_fire',
    'Sharp synthwave pistol shot, short snappy saw-wave pew with bright transient attack, thin body, light slapback delay tail, neon arcade character, punchy and readable',
    0.5, 0.55],
  ['shotgun_fire',
    'Heavy arcade shotgun blast, deep sub thump layered with filter-swept white noise burst sweeping from high to low, metallic shell eject tick at end, chest-punching weight',
    0.6, 0.55],
  ['rifle_fire',
    'Sharp synth rifle crack with clean metallic trigger click, short tight reverb tail, precise lethal cyberpunk marksman shot',
    0.5, 0.55],
  ['rpg_fire',
    'Hissing rocket launch whoosh with doppler pitch descent, metallic launch tube resonance, smoky noise tail, analog chunky synthwave launch',
    0.7, 0.55],
  ['smg_loop',
    'Continuous bitcrushed synth submachine gun chatter at very high rate, bright saw-wave pops with subtle pitch wobble, no reverb, sits like rapid hi-hat pattern, loopable',
    4.0, 0.6],
  ['minigun_loop',
    'Dense rapid-fire synthwave minigun hum, rolling stuttered saw-wave pops at extreme high rate, subtle pitch LFO, filter opens as it sustains, muscular sustained, loopable',
    4.0, 0.6],
  ['laser_loop',
    'Continuous modular synth laser beam, clean saw-wave with subtle tremolo and high shimmer overtone on top, slightly alive and unstable, sci-fi plasma stream, loopable',
    4.0, 0.6],
  ['flamethrower_loop',
    'Continuous fiery flamethrower roar, rich filtered noise with breathy throat formant, slow natural pitch flicker, no tonal center, pure burning texture, loopable',
    4.0, 0.6],
  ['lightning_fire',
    'Sharp electric synth zap, white noise burst through high-Q bandpass with descending pitched arc on top, crackling aggressive tesla coil discharge',
    0.5, 0.6],

  // ============ B. WEAPONS — ACTIONS ============
  ['reload_light',
    'Quick magazine eject click, mag slap insert, slide rack, two-tick mechanical pistol reload with subtle synth wubble underneath, tight and urgent',
    0.7, 0.5],
  ['reload_heavy',
    'Shell-by-shell pump-action shotgun reload, four hollow plastic shell clicks racking into chamber, final forestock pump slide, mechanical and weighty',
    1.5, 0.5],
  ['weapon_switch',
    'Holographic blip-swipe, FM bell arpeggio descending three notes with soft digital whoosh underneath, futuristic HUD weapon swap',
    0.5, 0.55],
  ['empty_clip',
    'Short dry metallic trigger click with faint descending minor-third synth uh-uh tone, disappointing terse out-of-ammo cue',
    0.5, 0.55],

  // ============ C. PLAYER ============
  ['dash',
    'Filtered white-noise whoosh with glitch stutter and downward pitch sweep, phase-shift teleport feel, synthwave blink, short and satisfying',
    0.5, 0.55],
  ['hurt',
    'Meaty body-hit thud with filtered noise for flesh impact and brief digital glitch overlay, punchy synthetic-organic player damage hit',
    0.5, 0.55],
  ['player_death',
    'Layered cinematic death stinger, descending minor synth brass scale with heartbeat flatline tone underneath, long reverse reverb tail, huge final synthwave tragedy',
    1.5, 0.55],
  ['heal',
    'Bright FM bell sweep rising over warm synth pad swell, relieved uplifting synthwave recovery moment',
    0.5, 0.5],
  ['level_up',
    'Synthwave power stab, major chord pad hit with ascending arpeggio bell and sub-bass drop, mini dopamine reward moment',
    0.5, 0.55],

  // ============ D. ZOMBIES — CORE ============
  ['zombie_groan_a',
    'Wet guttural zombie moan at low pitch with slight vocoded digital corruption artifact, uncanny organic-synthetic horror',
    0.8, 0.5],
  ['zombie_groan_b',
    'Raspy breathy zombie growl with higher pitched throat rattle and subtle bitcrushed digital corruption, menacing and cyber-infected',
    0.8, 0.5],
  ['zombie_groan_c',
    'Deep chest-heavy zombie bellow with wet phlegm texture and formant-shifted mouth shape, digital static artifact underneath',
    0.9, 0.5],
  ['zombie_death',
    'Body-fall thud of corpse hitting ground with wet gurgle and brief digital dissolve shimmer at end, organic-cyber zombie death',
    0.6, 0.55],
  ['zombie_attack',
    'Wet splorch of flesh claws layered with whoosh of air passing, short aggressive organic-horror swipe',
    0.5, 0.55],
  ['headshot',
    'Satisfying wet pop of exploding head layered with bright coin-like FM bell ping on top, arcade crit reward',
    0.5, 0.55],

  // ============ E. ENEMY TELEGRAPHS (CRITICAL) ============
  ['sniper_aim_loop',
    'Sustained high laser-pointer sine tone with subtle sparkle overtone, tense continuous warning cue of enemy sniper taking aim, loopable',
    1.5, 0.6],
  ['beam_charge',
    'Rising capacitor whine sweeping from low to high over one second, audibly ramping up, sci-fi weapon charging before deadly beam fires',
    1.0, 0.6],
  ['spitter_charge',
    'Wet bubbly phlegm buildup rising in pitch then sharp hrrk-PTOO expulsion at end, gross organic ranged-attack telegraph',
    0.7, 0.55],
  ['tank_pound_windup',
    'Rising deep mechanical hum with metallic clank, anticipatory telegraph before ground-pound impact, heavy enemy windup',
    0.7, 0.55],
  ['zombie_boss',
    'Cinematic synth brass stab with low horn blast, room-shaking sub-bass rumble, reverse-reverb whoosh leading in, massive ominous boss entrance',
    1.5, 0.55],

  // ============ F. POWER-UPS ============
  ['powerup_spawn_loop',
    'Glittering arpeggio bell loop, subtle twinkling synthwave beacon advertising power-up waiting on floor, inviting and bright, loopable',
    2.0, 0.55],
  ['powerup_activate',
    'Big rising synth sweep into bass hit with bright bell cascade on top, universal power-up activation moment, triumphant',
    0.7, 0.55],
  ['shield_break',
    'Glass force-field shatter with digital dissolve shimmer tail, dramatic protection loss',
    0.5, 0.55],
  ['powerup_expire_warning',
    'Descending pitch-wobble double-beep with subtle urgency cue, warning that buff is about to expire',
    0.5, 0.6],

  // ============ G. ELEMENTAL ============
  ['ice_freeze',
    'Big satisfying crystallize sound with upward glass shimmer sweep, hard click-lock at top, sparkle shimmer tail, enemy going frozen moment',
    0.6, 0.55],
  ['ice_shatter',
    'Glass shatter cluster with bright FM bell cascade on top, extremely satisfying ice-break arcade kill reward',
    0.5, 0.55],

  // ============ H. ENVIRONMENT ============
  ['barrel_explosion',
    'Big metallic boom with shrapnel whistle and ringing metal tail, industrial explosion distinct from organic flesh explosions',
    0.8, 0.55],
  ['door_open',
    'Mechanical servo whir with lock-disengage click and room-ambient level drop, room-clear relief moment',
    0.8, 0.5],
  ['exit_activate',
    'Rising whoosh with synthwave major chord bloom at peak, teleport-in-progress portal activation',
    0.8, 0.55],

  // ============ I. PROGRESSION MOMENTS ============
  ['card_legendary',
    'Full synthwave major chord stab with choir hit, sparkle cascade arpeggio, sub-bass drop, maximum dopamine legendary card reveal',
    0.8, 0.55],
  ['weapon_evolve',
    'Huge synthwave progression moment with sustained pad swell, FM bell cascade arpeggio rising, filter-sweep riser, satisfying downbeat thud with sub-bass drop, celebratory cinematic weapon evolution',
    1.2, 0.6],
];

function generateSound(text, duration_seconds, prompt_influence) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ text, duration_seconds, prompt_influence });
    const options = {
      hostname: 'api.elevenlabs.io',
      path: '/v1/sound-generation',
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', (d) => errBody += d);
        res.on('end', () => reject(new Error(`API ${res.statusCode}: ${errBody}`)));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  if (!fs.existsSync(SOUNDS_DIR)) fs.mkdirSync(SOUNDS_DIR);

  const queue = SOUND_DEFS.filter(([name]) => !ONLY || ONLY.has(name));
  console.log(`Generating ${queue.length} of ${SOUND_DEFS.length} sound effects${FORCE ? ' (FORCE: overwriting existing)' : ''}\n`);

  let done = 0, skipped = 0, failed = 0;
  for (const [filename, prompt, duration, influence] of queue) {
    const filePath = path.join(SOUNDS_DIR, `${filename}.mp3`);
    if (!FORCE && fs.existsSync(filePath)) {
      console.log(`  [skip] ${filename}.mp3`);
      skipped++;
      continue;
    }
    process.stdout.write(`  [gen]  ${filename}.mp3 ... `);
    try {
      const audio = await generateSound(prompt, duration, influence);
      fs.writeFileSync(filePath, audio);
      console.log(`done (${(audio.length / 1024).toFixed(1)} KB)`);
      done++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\nDone. generated=${done} skipped=${skipped} failed=${failed}`);
}

main();
