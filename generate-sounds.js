#!/usr/bin/env node
// Generate game sound effects using the ElevenLabs Sound Effects API.
// Usage: ELEVENLABS_API_KEY=your_key node generate-sounds.js
//
// Sounds are saved to the sounds/ directory as .mp3 files.
// Re-running will skip files that already exist (delete a file to regenerate it).

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Error: Set ELEVENLABS_API_KEY environment variable.');
  console.error('  ELEVENLABS_API_KEY=your_key node generate-sounds.js');
  process.exit(1);
}

const SOUNDS_DIR = path.join(__dirname, 'sounds');

// Each entry: [filename, prompt, duration_seconds, prompt_influence]
const SOUND_DEFS = [
  // --- Weapon fire sounds (retro arcade style) ---
  ['pistol_fire', '8-bit retro arcade pistol shot, short sharp chiptune blaster pop, NES game sound effect', 0.5, 0.6],
  ['revolver_fire', 'Retro arcade heavy gun blast, deep 8-bit booming shot, classic video game cannon fire', 0.5, 0.6],
  ['smg_fire', '8-bit rapid fire blip, short arcade machine gun tick, chiptune quick shot', 0.5, 0.6],
  ['burst_fire', 'Retro triple shot burst, 8-bit arcade three rapid blips, chiptune burst fire', 0.5, 0.6],
  ['shotgun_fire', '8-bit retro shotgun boom, chunky arcade blast, deep chiptune explosion pop', 0.5, 0.6],
  ['rifle_fire', 'Retro arcade sniper shot, sharp 8-bit high powered zap, piercing chiptune crack', 0.5, 0.6],
  ['minigun_fire', '8-bit retro minigun buzz, rapid arcade pew pew, chiptune machine gun whir', 0.5, 0.6],
  ['flamethrower_fire', 'Retro arcade flame burst, 8-bit fire whoosh, chiptune crackling hiss noise', 0.5, 0.6],
  ['laser_fire', '8-bit laser beam zap, classic arcade sci-fi pew, high pitched chiptune laser blast', 0.5, 0.6],
  ['lightning_fire', 'Retro arcade electric zap, 8-bit lightning crackle, chiptune tesla spark discharge', 0.5, 0.6],
  ['rpg_fire', '8-bit retro rocket launch, deep arcade rumble blast, chiptune heavy missile fire', 0.7, 0.6],
  ['grenade_fire', 'Retro arcade grenade thunk, 8-bit hollow tube launch pop, chiptune lob sound', 0.5, 0.6],

  // --- Game event sounds (retro arcade style) ---
  ['hit', '8-bit retro hit impact, short arcade enemy damage blip, chiptune thud', 0.5, 0.6],
  ['death', 'Retro arcade enemy death, 8-bit descending pitch death spiral, classic game kill sound', 0.7, 0.6],
  ['pickup', '8-bit retro item pickup, bright arcade powerup chime, classic video game collect jingle', 0.5, 0.6],
  ['dash', 'Retro arcade dash swoosh, 8-bit quick movement whoosh, chiptune speed burst', 0.5, 0.6],
  ['hurt', '8-bit retro player damage, arcade hit taken buzz, chiptune pain blip descending tone', 0.5, 0.6],
  ['explosion', 'Retro arcade explosion, 8-bit chunky blast boom, classic video game big explosion noise', 0.8, 0.6],
  ['reload', '8-bit retro reload click, arcade weapon charge up beeps, chiptune mechanical click sound', 0.6, 0.6],
  ['zombie_attack', 'Retro arcade monster bite, 8-bit creature attack chomp, chiptune enemy strike sound', 0.5, 0.6],

  // --- Ambient / UI (retro arcade style) ---
  ['level_complete', '8-bit retro level complete fanfare, short triumphant arcade victory jingle, chiptune celebration melody', 1.5, 0.6],
  ['game_over', 'Retro arcade game over jingle, 8-bit sad descending tones, classic video game defeat melody', 1.5, 0.6],
  ['footstep', '8-bit retro footstep tap, short arcade character movement blip', 0.5, 0.5],

  // --- New: Combat feedback ---
  ['headshot', '8-bit retro critical hit, sharp arcade high-pitched ding, satisfying chiptune bonus kill sound', 0.5, 0.6],
  ['empty_clip', '8-bit retro empty gun click, dry arcade trigger pull, chiptune hollow click no ammo', 0.5, 0.6],
  ['weapon_switch', 'Retro arcade weapon swap, 8-bit quick mechanical toggle click, chiptune equip sound', 0.5, 0.6],
  ['killstreak', '8-bit retro combo bonus, ascending arcade chiptune notes rapid killstreak jingle', 0.6, 0.6],

  // --- New: Zombie sounds ---
  ['zombie_groan', 'Retro arcade monster groan, 8-bit low pitch zombie moan, chiptune undead growl', 0.8, 0.6],
  ['zombie_spawn', '8-bit retro enemy appear, dark arcade spawn warble, chiptune creature emerge from ground', 0.5, 0.6],
  ['zombie_boss', 'Retro arcade boss alert, deep 8-bit ominous rumble, chiptune heavy stomping giant monster approach', 1.0, 0.6],

  // --- New: Environment ---
  ['door_open', '8-bit retro door creak open, arcade dungeon gate sliding, chiptune heavy stone door grinding', 0.7, 0.6],
  ['exit_found', 'Retro arcade secret found jingle, 8-bit discovery chime, bright chiptune exit reveal fanfare', 0.8, 0.6],
  ['ambient_drip', '8-bit retro cave water drip, short arcade dungeon ambient drop, chiptune echo plop', 0.5, 0.5],

  // --- New: Player state ---
  ['health_low', '8-bit retro low health warning, rapid arcade heartbeat beep beep, chiptune critical HP alarm', 0.8, 0.6],
  ['health_pickup', 'Retro arcade heal sound, 8-bit bright ascending recovery chime, chiptune health restore sparkle', 0.5, 0.6],
  ['armor_pickup', '8-bit retro shield powerup, deep arcade armor equip clang, chiptune metal shield activate', 0.5, 0.6],
  ['player_death', 'Retro arcade player death, 8-bit dramatic descending spiral game over sting, chiptune hero falls', 1.0, 0.6],

  // --- New: UI / Menu ---
  ['menu_select', '8-bit retro menu select blip, short arcade UI confirm beep, chiptune button press', 0.5, 0.6],
  ['menu_hover', 'Retro arcade menu hover tick, tiny 8-bit UI cursor move blip, soft chiptune navigation', 0.5, 0.5],
  ['countdown', '8-bit retro countdown beep, arcade ready set go tick, chiptune timer pulse', 0.5, 0.6],
  ['wave_start', 'Retro arcade new wave alarm, 8-bit warning siren blare, chiptune incoming enemies klaxon', 1.0, 0.6],
];

function generateSound(text, duration_seconds, prompt_influence) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      duration_seconds,
      prompt_influence,
    });

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

  console.log(`Generating ${SOUND_DEFS.length} sound effects...\n`);

  for (const [filename, prompt, duration, influence] of SOUND_DEFS) {
    const filePath = path.join(SOUNDS_DIR, `${filename}.mp3`);

    if (fs.existsSync(filePath)) {
      console.log(`  [skip] ${filename}.mp3 (already exists)`);
      continue;
    }

    process.stdout.write(`  [gen]  ${filename}.mp3 ... `);
    try {
      const audio = await generateSound(prompt, duration, influence);
      fs.writeFileSync(filePath, audio);
      console.log(`done (${(audio.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log('\nDone! Sound files are in the sounds/ directory.');
}

main();
