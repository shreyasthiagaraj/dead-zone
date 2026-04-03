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
  // --- Weapon fire sounds: per-shot (gritty, punchy, visceral) ---
  ['pistol_fire', 'Snappy compact pistol gunshot, tight percussive handgun crack with sharp metallic bite, punchy close quarters pop', 0.5, 0.6],
  ['revolver_fire', 'Heavy magnum revolver gunshot, deep booming handcannon blast with reverb, powerful single shot', 0.6, 0.5],
  ['smg_fire', 'Short submachine gun burst, rapid metallic rattling gunfire, compact automatic weapon pop', 0.5, 0.5],
  ['burst_fire', 'Three round burst fire, triple tap assault rifle shots, tactical burst with shell casings', 0.5, 0.5],
  ['shotgun_fire', 'Loud pump shotgun blast, deep chunky bassy boom with pellet spread, devastating close range', 0.6, 0.5],
  ['rifle_fire', 'High powered sniper rifle crack, sharp supersonic snap with heavy recoil thud, echoing shot', 0.6, 0.5],
  ['lightning_fire', 'Loud violent electrical arc discharge, high voltage sparking with sharp crackling thunder snap, raw dangerous electricity jumping between conductors', 0.6, 0.6],
  ['rpg_fire', 'Rocket launcher firing, deep whooshing rocket propulsion blast with backblast, heavy ordnance', 0.8, 0.5],
  ['grenade_fire', 'Grenade launcher thump, hollow metallic tube launch thud, lobbed projectile whoosh', 0.5, 0.5],

  // --- Weapon loop sounds: sustained fire for high-RPM weapons ---
  ['minigun_loop', 'Sustained heavy minigun barrage, continuous rotary cannon roaring with high speed mechanical whirring and brass casings raining, nonstop automatic fire', 4.0, 0.6],
  ['minigun_spinup', 'Minigun barrel spinning up, accelerating mechanical whir getting faster and higher pitched, motor revving', 0.8, 0.6],
  ['flamethrower_loop', 'Sustained flamethrower roaring fire stream, continuous intense rushing flames with hissing pressurized gas and crackling fire, burning inferno', 4.0, 0.6],
  ['flamethrower_ignite', 'Flamethrower pilot light ignition, sharp gas hiss with clicking igniter then fire catching whoosh', 0.6, 0.5],
  ['laser_loop', 'Sustained sci-fi laser beam firing, continuous buzzing energy beam with high pitched electrical hum and sizzling ionized air, plasma stream', 4.0, 0.6],
  ['smg_loop', 'Sustained automatic submachine gun fire, continuous rapid rattling gunshots with metallic cycling and shell casings, nonstop compact automatic', 4.0, 0.6],

  // --- Combat feedback (visceral, satisfying) ---
  ['hit', 'Wet flesh impact thud, bullet hitting meat with squelchy punch, gore splat', 0.5, 0.5],
  ['death', 'Zombie death splatter, wet crunching body collapse with gurgling, bones snapping flesh tearing', 0.8, 0.5],
  ['headshot', 'Critical headshot impact, skull cracking wet pop with splattering gore, devastating blow', 0.5, 0.5],
  ['explosion', 'Heavy explosion blast, deep booming detonation with debris shrapnel flying, fire roaring outward', 1.0, 0.5],
  ['killstreak', 'Dark rewarding kill combo chime, sinister ascending metallic tones, ominous power surge sound', 0.8, 0.5],

  // --- Player sounds ---
  ['hurt', 'Male pain grunt taking damage, short strained gasp with flesh impact thud, getting hit hard', 0.5, 0.5],
  ['player_death', 'Player death collapse, pained groan falling to ground, body hitting floor with last breath', 1.0, 0.5],
  ['dash', 'Quick combat dodge whoosh, fast body movement rush of air, tactical sprint burst', 0.5, 0.5],
  ['footstep', 'Single boot footstep on concrete, gritty sole scrape on dungeon floor, indoor step', 0.5, 0.4],
  ['health_low', 'Tense low health heartbeat, slow heavy pounding heart with labored breathing, critical condition', 1.5, 0.5],

  // --- Weapon interaction ---
  ['reload', 'Gun magazine reload, metallic click clack of magazine insertion and slide rack, weapon ready', 0.7, 0.5],
  ['empty_clip', 'Dry fire gun click, empty magazine trigger pull with hollow metallic click, no ammo', 0.5, 0.5],
  ['weapon_switch', 'Quick weapon swap, metallic holster draw with fabric rustle, equipping new gun click', 0.5, 0.5],

  // --- Zombie sounds (creepy, unsettling, organic) ---
  ['zombie_attack', 'Zombie bite attack, wet snarling chomp with tearing flesh, undead creature lunging', 0.6, 0.5],
  ['zombie_groan', 'Creepy zombie moan, low guttural undead groan echoing in dark hallway, unsettling', 1.2, 0.5],
  ['zombie_spawn', 'Zombie emerging from darkness, wet dragging flesh on concrete with distant guttural growl', 0.8, 0.5],
  ['zombie_boss', 'Giant monster roar, deep rumbling creature howl shaking walls, massive undead boss approaching', 1.5, 0.5],

  // --- Pickup sounds (satisfying but not too bright) ---
  ['pickup', 'Weapon ammo pickup, quick metallic grab with subtle clicking, collecting equipment', 0.5, 0.4],
  ['health_pickup', 'Medical item pickup, syringe injection hiss with relieved breath, healing sound', 0.6, 0.5],
  ['armor_pickup', 'Armor equip sound, heavy metallic plates clicking into place, protective gear on', 0.6, 0.5],

  // --- Environment (atmospheric, tension-building) ---
  ['door_open', 'Heavy metal door creaking open, rusty hinges grinding with echoing scrape, dungeon door', 1.0, 0.5],
  ['exit_found', 'Eerie discovery reveal, low ominous chord with distant light shimmer sound, way out found', 1.0, 0.5],
  ['ambient_drip', 'Single water drip in dark tunnel, echoing drop splashing in puddle, underground cave', 0.8, 0.4],

  // --- Game state (dramatic, mood-setting) ---
  ['level_complete', 'Dark level complete sting, ominous triumphant horn with relieved exhale, survived another floor', 2.0, 0.5],
  ['game_over', 'Game over death sting, dark dramatic descending tones fading to silence, final defeat', 2.5, 0.5],
  ['wave_start', 'Zombie horde incoming alarm, distant rumbling growing louder with growling undead, they are coming', 1.5, 0.5],

  // --- UI (subtle, clean) ---
  ['menu_select', 'Dark UI click confirm, subtle metallic button press with soft low tone, menu selection', 0.5, 0.4],
  ['menu_hover', 'Soft UI hover tick, quiet subtle click, minimal interface sound', 0.5, 0.3],
  ['countdown', 'Tense countdown tick, deep reverberant clock tick with ominous tone, time running', 0.5, 0.5],

  // --- Background music loops ---
  ['music_ambient', 'Dark horror ambient drone, deep low frequency humming with distant metallic scraping and eerie whispers, underground dungeon atmosphere, unsettling tension building pad, creepy', 10.0, 0.6],
  ['music_combat', 'Intense dark electronic combat music, driving aggressive synth bass with pounding industrial drums and distorted guitar, action horror battle theme, fast tempo adrenaline', 10.0, 0.6],
  ['music_menu', 'Dark atmospheric horror menu theme, slow haunting piano notes with deep reverberant drone and distant thunder rumble, ominous and foreboding, title screen music', 10.0, 0.6],
  ['music_gameover', 'Somber dark game over music, slow mournful strings fading with deep reverberant echoes, melancholic defeat theme dissolving into silence', 8.0, 0.6],
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
