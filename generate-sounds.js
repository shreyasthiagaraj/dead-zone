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
  // --- Weapon fire sounds ---
  ['pistol_fire', 'Single pistol gunshot, small caliber, sharp crack, indoor echo', 0.5, 0.5],
  ['revolver_fire', 'Heavy revolver gunshot, powerful single shot, loud crack with reverb', 0.7, 0.5],
  ['smg_fire', 'Single submachine gun shot, rapid light metallic pop', 0.5, 0.5],
  ['burst_fire', 'Three round burst fire, assault rifle, quick triple tap', 0.6, 0.5],
  ['shotgun_fire', 'Shotgun blast, pump action, deep boom with shell casing', 0.8, 0.5],
  ['rifle_fire', 'Sniper rifle single shot, heavy high caliber crack, powerful echo', 0.8, 0.5],
  ['minigun_fire', 'Minigun single bullet rapid fire burst, metallic buzzing whir', 0.5, 0.5],
  ['flamethrower_fire', 'Flamethrower burst, whooshing fire roar, hissing gas ignition', 0.7, 0.5],
  ['laser_fire', 'Sci-fi laser blaster shot, high pitched electric zap', 0.5, 0.5],
  ['lightning_fire', 'Electric arc discharge, tesla coil zap, crackling electricity', 0.6, 0.5],
  ['rpg_fire', 'RPG rocket launcher firing, deep rumbling whoosh launch', 0.8, 0.5],
  ['grenade_fire', 'Grenade launcher thump, hollow tube launch sound', 0.6, 0.5],

  // --- Game event sounds ---
  ['hit', 'Zombie flesh impact, wet meaty punch hit, gore splatter', 0.5, 0.5],
  ['death', 'Zombie death groan, guttural dying monster growl', 0.8, 0.5],
  ['pickup', 'Weapon pickup chime, bright metallic item collect sound, video game powerup', 0.5, 0.5],
  ['dash', 'Quick dash whoosh, fast air movement, short speed burst', 0.5, 0.5],
  ['hurt', 'Player pain grunt, human taking damage, short yelp', 0.5, 0.5],
  ['explosion', 'Large explosion, fiery blast with debris, rumbling boom', 1.0, 0.5],
  ['reload', 'Gun reload, magazine click and slide rack, mechanical weapon reload', 0.7, 0.5],
  ['zombie_attack', 'Zombie bite attack, monster snarl with wet chomp', 0.5, 0.5],

  // --- Ambient / UI ---
  ['level_complete', 'Level complete victory jingle, short triumphant fanfare', 1.5, 0.5],
  ['game_over', 'Game over dark sting, ominous defeat sound, horror game over', 1.5, 0.5],
  ['footstep', 'Single footstep on concrete, indoor boot step', 0.5, 0.4],
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
