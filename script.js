let audioCtx = null, isSpinning = false, lastTickSegment = -1;

function initAudio() {
  if (!audioCtx) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    } catch(e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(()=>{});
  }
}

function playTick() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.type = 'triangle'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.02);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.02);
  } catch(e) {}
}

function trackSpinSound(targetRotation, startTime, duration) {
  if (!isSpinning || !currentStage) return;
  const now = performance.now();
  const elapsed = now - startTime;
  let progress = elapsed / duration;
  if (progress > 1) progress = 1;
  
  const easeOut = 1 - Math.pow(1 - progress, 3);
  const currentAng = targetRotation * easeOut;
  const pAng = (360 - (currentAng % 360) + 90) % 360; 
  
  let tW = currentStage.options.reduce((sum, opt) => sum + opt.weight, 0), acc = 0, cSeg = -1;
  for (let i = 0; i < currentStage.options.length; i++) {
    let sA = (currentStage.options[i].weight / tW) * 360;
    if (pAng >= acc && pAng <= acc + sA) { cSeg = i; break; }
    acc += sA;
  }
  
  if (cSeg !== -1 && cSeg !== lastTickSegment && progress < 0.99) { 
    playTick(); 
    lastTickSegment = cSeg; 
  }
  if (progress < 1) requestAnimationFrame(() => trackSpinSound(targetRotation, startTime, duration));
}

const colors = ['#0284c7', '#7c3aed', '#dc2626', '#16a34a', '#db2777', '#d97706', '#2563eb', '#9333ea', '#be185d', '#0f766e', '#ea580c', '#65a30d'];

// --- STATYSTYKI ---
const levelStats = [
  { label: "Civilian", pwr: 0 }, { label: "East Blue Rookie", pwr: 5000000 }, { label: "Grand Line Pirate", pwr: 20000000 },
  { label: "Supernova Level", pwr: 100000000 }, { label: "Warlord Level", pwr: 250000000 }, { label: "Yonko Commander", pwr: 400000000 },
  { label: "Admiral Level", pwr: 700000000 }, { label: "Yonko Level", pwr: 1000000000 }, { label: "Pirate King Level", pwr: 1500000000 }
];

const masteryLevels = [
  { label: "No Talent", pwr: 0 }, { label: "Learning / Amateur", pwr: 10000000 }, { label: "Average", pwr: 30000000 },
  { label: "Skilled", pwr: 80000000 }, { label: "Expert", pwr: 200000000 }, { label: "Mastered", pwr: 400000000 }, { label: "Perfection", pwr: 800000000 }
];

const obsHakiLevels = [
  { label: "Basic", pwr: 50000000 }, { label: "Intermediate", pwr: 150000000 }, { label: "Advanced (Future Sight)", pwr: 400000000 }, { label: "Mastered (Future Sight)", pwr: 1000000000 }
];
const armHakiLevels = [
  { label: "Basic", pwr: 50000000 }, { label: "Intermediate", pwr: 150000000 }, { label: "Advanced (Internal Dest.)", pwr: 400000000 }, { label: "Mastered (Internal Dest.)", pwr: 1000000000 }
];
const conqHakiLevels = [
  { label: "Basic", pwr: 100000000 }, { label: "Intermediate", pwr: 300000000 }, { label: "Advanced (ACoC)", pwr: 1000000000 }, { label: "Mastered (ACoC)", pwr: 2000000000 }
];

const opWeapons = ["Supreme Grade Sword", "Great Grade Sword", "Skillful Grade Sword", "Black Blade", "Clima-Tact", "Germa Raid Suit", "Seastone Jitte", "Seastone Knuckles", "Pacifista Lasers", "Kuja Snake Bow", "Iron Mace (Kanabo)", "Sniper Rifle", "Cyborg Enhancements", "Dial Arsenal", "Pop Greens", "Fish-Man Karate Water Bullets", "Standard Flintlock", "Kikoku", "Raiu"];
const opFruitsParamecia = ["Gura Gura (Quake)", "Ope Ope (Room)", "Zushi Zushi (Gravity)", "Ito Ito (String)", "Mochi Mochi", "Nikyu Nikyu (Paw)", "Doku Doku (Poison)", "Soru Soru (Soul)", "Gomu Gomu (Gum)", "Bari Bari (Barrier)", "Bara Bara (Chop)", "Mero Mero (Love)", "Horo Horo (Ghost)", "Yomi Yomi (Revive)", "Jiki Jiki (Magnet)", "Kage Kage (Shadow)", "Horu Horu (Hormone)", "Fuwa Fuwa (Float)", "Supa Supa (Dice)", "Bomu Bomu (Bomb)", "Bane Bane (Spring)", "Kilo Kilo (Weight)", "Ton Ton (Ton)", "Woshu Woshu (Wash)", "Choki Choki (Snip)", "Sui Sui (Swim)", "Memo Memo (Memory)", "Buki Buki (Weapon)", "Doru Doru (Wax)", "Mane Mane (Clone)", "Toge Toge (Spike)", "Noko Noko (Mushroom)", "Sube Sube (Smooth)", "Hira Hira (Flag)", "Ishi Ishi (Stone)"];
const opFruitsLogia = ["Mera Mera (Fire)", "Goro Goro (Lightning)", "Hie Hie (Ice)", "Magu Magu (Magma)", "Pika Pika (Light)", "Yami Yami (Darkness)", "Suna Suna (Sand)", "Moku Moku (Smoke)", "Mori Mori (Woods)", "Gasu Gasu (Gas)", "Yuki Yuki (Snow)", "Numa Numa (Swamp)"];
const opFruitsZoan = ["Neko: Leopard", "Inu: Wolf", "Ushi: Giraffe", "Zou: Elephant", "Mogu: Mole", "Tori: Falcon", "Inu: Dachshund", "Inu: Jackal", "Ushi: Bison", "Hito: Human", "Kumo: Rosamygale", "Hebi: Anaconda", "Hebi: Cobra", "Kame: Turtle"];
const opFruitsAncient = ["Ryu: Pteranodon", "Ryu: Brachiosaurus", "Ryu: Allosaurus", "Ryu: Spinosaurus", "Ryu: Triceratops", "Zou: Mammoth", "Kumo: Rosamygale (Ancient)", "Neko: Saber Tiger"];
const opFruitsMythical = ["Hito: Nika (Sun God)", "Uo: Seiryu (Dragon)", "Tori: Phoenix", "Hito: Daibutsu (Buddha)", "Inu: Okuchi no Makami", "Inu: Kitsune", "Hebi: Yamata no Orochi", "Hito: Onyudo", "Uma: Pegasus", "Batto: Vampire"];

const enemies = {
  "Buggy the Clown": 15000000, "Gecko Moria": 320000000, "Bartholomew Kuma": 296000000, "Sir Crocodile": 1965000000, "Jinbe": 1100000000, "Donquixote Doflamingo": 1000000000, "Boa Hancock": 1659000000, "Trafalgar Law": 3000000000, "Edward Weevil": 480000000, "Dracule Mihawk": 3590000000,
  "Captain Koby": 500000000, "Vice Admiral Smoker": 300000000, "Vice Admiral Momonga": 300000000, "Admiral Ryokugyu": 3000000000, "Admiral Fujitora": 3000000000, "Admiral Kizaru": 3000000000, "Admiral Aokiji": 3000000000, "Fleet Admiral Akainu": 4000000000, "Prime Sengoku": 5000000000, "Prime Garp": 5000000000, "Magellan": 1500000000,
  "Rob Lucci (CP0)": 1200000000, "Kaku (CP0)": 850000000, "Stussy (CP0)": 750000000, "Guernika (CP0)": 600000000, "Maha (CP0)": 500000000, "Joseph (CP0)": 500000000, "Gismonda (CP0)": 500000000, "Jabra": 300000000, "Blueno": 200000000, "Kalifa": 150000000, "Kumadori": 150000000, "Fukurou": 150000000, "Spandam": 5000000,
  "Eustass Kid": 3000000000, "Killer": 200000000, "Capone Bege": 350000000, "Jewelry Bonney": 320000000, "Basil Hawkins": 320000000, "X Drake": 222000000, "Scratchmen Apoo": 350000000, "Urouge": 108000000,
  "Jack the Drought": 1000000000, "Cracker": 860000000, "Smoothie": 932000000, "Queen the Plague": 1320000000, "King the Wildfire": 1390000000, "Katakuri": 1057000000, "Marco the Phoenix": 1374000000, "Jozu": 1200000000, "Vista": 1100000000, "Shiryu of the Rain": 1500000000, "Benn Beckman": 2000000000, "Lucky Roux": 1500000000, "Yasopp": 1300000000,
  "Emperor Buggy": 3189000000, "Blackbeard": 3996000000, "Big Mom": 4388000000, "Kaido": 4611100000, "Shanks": 4048900000,
  "Kozuki Oden": 3000000000, "Prime Whitebeard": 5046000000, "Gol D. Roger": 5564800000, "Rocks D. Xebec": 6000000000, "Gorosei (Saint Saturn)": 5000000000, "Gorosei (Saint Nusjuro)": 5000000000, "Saint Figarland Garling": 5000000000, "Imu-sama": 10000000000,
  "Belo Betty": 850000000, "Karasu": 900000000, "Lindbergh": 800000000, "Morley": 800000000, "Emporio Ivankov": 1000000000, "Ginny": 150000000, "Sabo (Flame Emperor)": 2500000000, "Monkey D. Dragon": 5000000000, "Enel": 500000000
};

// SYSTEM ZMIENNYCH
let characterState = {}; 
let characterSheet = [];
let currentStage = null;
let stepIndex = 0;
let currentRotation = 0;

let totalBounty = 0;
let enemyBounty = 0;
let victoryCount = 0; 
let roadPoneglyphs = 0;
let hasEscaped = false; 

// --- ZMIENNE GAUNTLETU (FINAŁOWEJ WOJNY) ---
let inFinalWar = false;
let finalBossTier = 0;

function getGauntlet(fac) {
    if (fac === "Pirate") return ["Prime Sengoku", "Prime Whitebeard", "Gol D. Roger", "Rocks D. Xebec"];
    if (fac === "Marine") return ["Kozuki Oden", "Prime Whitebeard", "Gol D. Roger", "Rocks D. Xebec"];
    if (fac === "Revolutionary") return ["Saint Figarland Garling", "Gorosei (Saint Saturn)", "Gorosei (Saint Nusjuro)", "Imu-sama"];
    return ["Prime Garp", "Gol D. Roger", "Rocks D. Xebec", "Imu-sama"];
}

function createStage(badge, key, optionsObjArray) {
  return { badge, key, options: optionsObjArray.map((o, i) => ({ label: o.label, weight: o.weight || 10, pwr: o.pwr || 0, color: o.color || colors[i % colors.length] })) };
}

function toWeighted(arr) { return arr.map(a => ({label: a, weight: 10})); }

function updateStatusBar() {
  let sb = document.getElementById("statusBar");
  if(!sb) return;
  if (characterState["Faction"] === "Pirate") sb.innerText = `Journey Progress: ${victoryCount} | Poneglyphs: ${roadPoneglyphs}/4 | Bounty: ${totalBounty.toLocaleString()}`;
  else sb.innerText = `Journey Progress: ${victoryCount} | Bounty: ${totalBounty.toLocaleString()}`;
}

function updateLiveSheet() {
  let sheet = document.getElementById("liveSheet");
  if (!sheet) {
      sheet = document.createElement("div");
      sheet.id = "liveSheet";
      sheet.className = "live-sheet";
      document.body.appendChild(sheet);
  }
  
  if(characterSheet.length > 0) sheet.classList.add("active");
  
  let html = `<div class="live-sheet-header">WANTED</div>`;
  html += `<div class="live-sheet-bounty">${totalBounty.toLocaleString()} <br><span>BELI</span></div>`;
  
  const displayKeys = ["Race", "Faction", "Lineage", "Devil Fruit", "Fruit Mastery", "Awakening", "Weapon", "Weapon Mastery", "Observation Haki", "Armament Haki", "Conqueror's Haki", "Strength", "Speed", "Battle IQ"];
  
  displayKeys.forEach(k => {
      let item = characterSheet.find(e => e.key === k);
      if (item && item.val !== "None" && item.val !== "No Haki" && item.val !== "Not Awakened") {
          let shortKey = k.replace(" Haki", "");
          html += `<div class="live-row"><span class="live-label">${shortKey}:</span><span class="live-val">${item.val}</span></div>`;
      }
  });
  sheet.innerHTML = html;
}

function applyUpgrade(statName, tiers) {
  let key = statName, arr;
  if(key === "Strength" || key === "Speed" || key === "Battle IQ") arr = levelStats;
  else if(key === "Weapon Mastery" || key === "Fruit Mastery") arr = masteryLevels;
  else if(key === "Observation Haki") arr = obsHakiLevels;
  else if(key === "Armament Haki") arr = armHakiLevels;
  else if(key === "Conqueror's Haki") arr = conqHakiLevels;

  let currentLabel = characterState[key];
  if(!currentLabel) return { msg: `Cannot train ${key}!`, pwrDiff: 0, key: key, newLabel: currentLabel };

  let idx = arr.findIndex(x => x.label === currentLabel);
  if(idx === -1) return { msg: `${key} cannot be trained further.`, pwrDiff: 0, key: key, newLabel: currentLabel };
  
  let newIdx = Math.min(idx + tiers, arr.length - 1);
  if (newIdx === idx) return { msg: `${key} is Maxed!`, pwrDiff: 0, key: key, newLabel: currentLabel };

  let newObj = arr[newIdx];
  let diff = newObj.pwr - arr[idx].pwr;
  return { msg: `${key} UPGRADED to ${newObj.label}!`, pwrDiff: diff, key: key, newLabel: newObj.label };
}

// --- SILNIK FABULARNY ---
function getNextStage() {
  switch(stepIndex) {
    case 0: return createStage("⚓ 1. Race", "Race", [{label: "Human", weight: 45}, {label: "Fishman", weight: 15, pwr: 10000000}, {label: "Mink", weight: 10, pwr: 20000000}, {label: "Giant", weight: 8, pwr: 50000000}, {label: "Cyborg", weight: 8, pwr: 30000000}, {label: "Lunarian", weight: 4, pwr: 300000000}, {label: "Celestial Dragon", weight: 8, pwr: 100000000, color: '#f59e0b'}]);
    case 1: {
      let fOpts = [{label: "Pirate", weight: 40}, {label: "Marine", weight: 25}, {label: "Revolutionary", weight: 15}, {label: "Bounty Hunter", weight: 10}, {label: "Tenryubito Overlord", weight: 5, color: '#f59e0b'}, {label: "Holy Knight", weight: 5, color: '#8b5cf6'}];
      if (characterState["Race"] === "Celestial Dragon") return createStage("👑 2. Status", "Faction", [{label: "Tenryubito Overlord", weight: 100, color: '#f59e0b'}]);
      if (characterState["Race"] === "Holy Knight Bloodline") return createStage("⚔️ 2. Status", "Faction", [{label: "Holy Knight", weight: 100, color: '#8b5cf6'}]);
      return createStage("🏴‍☠️ 2. Faction", "Faction", fOpts);
    }
    case 2: {
      let fac = characterState["Faction"];
      if (fac === "Tenryubito Overlord" || fac === "Holy Knight") return createStage("👑 3. Noble Family", "Lineage", [{label: "Donquixote Family", weight: 15, pwr: 50000000}, {label: "Jaygarcia Family", weight: 10, pwr: 150000000}, {label: "Figarland Family", weight: 15, pwr: 150000000}, {label: "Marcus Family", weight: 10, pwr: 150000000}, {label: "Nefertari Family", weight: 10, pwr: 50000000}, {label: "Shepherd Family", weight: 10, pwr: 150000000}, {label: "Ethanbaron Family", weight: 10, pwr: 150000000}, {label: "Topman Family", weight: 10, pwr: 150000000}, {label: "Nerona Family", weight: 2, pwr: 300000000}, {label: "Manmayer Family", weight: 8, pwr: 80000000}]);
      else if (fac === "Pirate" || fac === "Revolutionary") return createStage("🧬 3. Lineage", "Lineage", [{label: "Will of D. (Monkey/Gol/Rocks)", weight: 15, pwr: 200000000}, {label: "Standard Bloodline", weight: 85, pwr: 0}]);
      else return createStage("🧬 3. Background", "Lineage", [{label: "Marine Hero Descendant", weight: 15, pwr: 100000000}, {label: "Standard Background", weight: 85, pwr: 0}]);
    }
    case 3: return createStage("🍖 4. Fruit Type", "Fruit Category", [{label: "Paramecia", weight: 25}, {label: "Zoan (Incl. Ancient)", weight: 15}, {label: "Logia", weight: 10}, {label: "Mythical Zoan", weight: 5}, {label: "None", weight: 45}]);
    case 4: {
      if (characterState["Fruit Category"] !== "None") {
        let cat = characterState["Fruit Category"];
        let fList = cat === "Logia" ? opFruitsLogia : (cat === "Mythical Zoan" ? opFruitsMythical : (cat === "Zoan (Incl. Ancient)" ? opFruitsAncient.concat(opFruitsZoan) : opFruitsParamecia));
        return createStage("🍎 Specific Fruit", "Devil Fruit", toWeighted(fList));
      }
      stepIndex = 7; return getNextStage(); 
    }
    case 5: return createStage("🔥 Fruit Mastery", "Fruit Mastery", masteryLevels);
    case 6: {
      let awkYes = 5, awkNo = 95, m = characterState["Fruit Mastery"];
      if(m === "Mastered" || m === "Perfection") { awkYes = 80; awkNo = 20; } else if(m === "Expert") { awkYes = 40; awkNo = 60; } else if(m === "Skilled") { awkYes = 15; awkNo = 85; }
      return createStage("💫 Awakening?", "Awakening", [{label: "AWAKENED!", weight: awkYes, pwr: 500000000, color: '#16a34a'}, {label: "Not Awakened", weight: awkNo, color: '#dc2626'}]);
    }
    case 7: {
      let hOpts = [{label: "No Haki", weight: 20, pwr: 0, color: '#dc2626'}, {label: "Two Colors (Obs & Arm)", weight: 60, pwr: 0, color: '#2563eb'}, {label: "Supreme King (All 3)", weight: 20, pwr: 0, color: '#f59e0b'}];
      let lin = characterState["Lineage"] || "";
      if (lin.includes("Will of D.") || characterState["Race"] === "Celestial Dragon") hOpts[2].weight = 50; 
      return createStage("👑 Haki Potential", "Haki Potential", hOpts);
    }
    case 8: {
      if (characterState["Haki Potential"] === "No Haki") { stepIndex = 11; return getNextStage(); }
      return createStage("👁️ Obs Haki", "Observation Haki", [{label: "Basic", weight: 50, color: '#3b82f6'}, {label: "Intermediate", weight: 30, color: '#2563eb'}, {label: "Advanced (Future Sight)", weight: 10, color: '#1e3a8a', pwr: 400000000}]);
    }
    case 9: {
      if (characterState["Haki Potential"] === "No Haki") { stepIndex = 11; return getNextStage(); }
      return createStage("👊 Armament Haki", "Armament Haki", [{label: "Basic", weight: 50, color: '#16a34a'}, {label: "Intermediate", weight: 30, color: '#15803d'}, {label: "Advanced (Internal Dest.)", weight: 10, color: '#14532d', pwr: 400000000}]);
    }
    case 10: {
      if (characterState["Haki Potential"] !== "Supreme King (All 3)") { stepIndex = 11; return getNextStage(); }
      return createStage("👑 Conqueror's", "Conqueror's Haki", [{label: "Basic", weight: 50, color: '#f59e0b'}, {label: "Intermediate", weight: 30, color: '#d97706'}, {label: "Advanced (ACoC)", weight: 10, color: '#b45309', pwr: 1000000000}]);
    }
    case 11: return createStage("⚔️ Weapon", "Weapon", toWeighted(opWeapons));
    case 12: return createStage("🎯 Weapon Mastery", "Weapon Mastery", masteryLevels);
    case 13: return createStage("💪 Strength/AP", "Strength", levelStats);
    case 14: return createStage("⚡ Speed", "Speed", levelStats);
    case 15: return createStage("🧠 Battle IQ", "Battle IQ", levelStats);
    
    // --- GŁÓWNA PĘTLA PODRÓŻY / WOJNY ---
    case 16: { 
      let currFac = characterState["Faction"];
      
      // JEŚLI JESTEŚ W FINAŁOWEJ WOJNIE (GAUNTLET BSSÓW)
      if (inFinalWar) {
          let g = getGauntlet(currFac);
          if (finalBossTier < g.length) {
              return createStage("⚔️ Final War", "Event", [
                  {label: "Face " + g[finalBossTier], weight: 80, color: '#dc2626', pwr: 0},
                  {label: "Intense Training", weight: 20, color: '#2563eb', pwr: 0}
              ]);
          }
      }

      // JEŚLI JESTEŚ W TRAKCIE ZWYKŁEJ PODRÓŻY
      let opts = [];
      let isEarly = victoryCount < 3, isMid = victoryCount >= 3 && victoryCount < 5, isLate = victoryCount >= 5;
      
      opts.push({label: "Intense Training", weight: 12, pwr: 0}); 
      
      // Lore / Peaceful Events
      if (isEarly) {
          opts.push({label: "Discover Sunken Treasure", weight: 12, color: '#eab308', pwr: 0});
          opts.push({label: "Grand Banquet", weight: 10, color: '#10b981', pwr: 0});
          opts.push({label: "Navigate a Deadly Anomaly", weight: 10, color: '#3b82f6', pwr: 0});
      } else if (isMid) {
          opts.push({label: "Meet a Legendary Mentor", weight: 10, color: '#8b5cf6', pwr: 0});
          opts.push({label: "Recruit a Powerful Ally", weight: 12, color: '#3b82f6', pwr: 0});
      } else if (isLate) {
          opts.push({label: "Discover an Ancient Ruin", weight: 10, color: '#6366f1', pwr: 0});
          opts.push({label: "Underworld Auction", weight: 10, color: '#ef4444', pwr: 0});
      }

      // Nauka Owocu / Haki w locie
      let learnWeight = isLate ? 4 : 10;
      if (characterState["Fruit Category"] === "None") opts.push({label: "Found a Mysterious Fruit", weight: learnWeight, color: '#db2777', pwr: 0});
      if (characterState["Haki Potential"] === "No Haki" && victoryCount >= 1) opts.push({label: "Haki Awakening", weight: learnWeight, color: '#9333ea', pwr: 0});

      // Zwykłe Walki
      if (currFac === "Pirate") {
          if (isEarly) {
              opts.push({label: "Clash with Warlord", weight: 25, pwr: 0}); opts.push({label: "Marine Ambush", weight: 25, pwr: 0}); opts.push({label: "Supernova Clash", weight: 20, pwr: 0});
              if (roadPoneglyphs < 4) opts.push({label: "Search for Road Poneglyph", weight: 15, pwr: 0});
          } else if (isMid) {
              opts.push({label: "Yonko Commander Duel", weight: 30, pwr: 0}); opts.push({label: "Admiral Ambush", weight: 20, pwr: 0}); opts.push({label: "Clash with Warlord", weight: 15, pwr: 0});
              if (roadPoneglyphs < 4) opts.push({label: "Search for Road Poneglyph", weight: 25, pwr: 0});
          } else if (isLate) {
              opts.push({label: "Yonko Conflict", weight: 30, pwr: 0}); opts.push({label: "Admiral Ambush", weight: 25, pwr: 0}); opts.push({label: "Marine Fleet Ambush", weight: 20, pwr: 0});
              if (roadPoneglyphs < 4) opts.push({label: "Search for Road Poneglyph", weight: 40, pwr: 0});
              let goalWeight = roadPoneglyphs >= 4 ? Math.max(0, (victoryCount - 4) * 30) : 0;
              if (goalWeight > 0) opts.push({label: "Reach Laugh Tale (FINAL GOAL)", weight: goalWeight, color: '#f59e0b', pwr: 0});
          }
      } 
      else if (currFac === "Marine") {
          if (isEarly) { opts.push({label: "Raid Pirate Crew", weight: 30, pwr: 0}); opts.push({label: "Supernova Clash", weight: 25, pwr: 0}); opts.push({label: "Clash with Warlord", weight: 20, pwr: 0}); }
          else if (isMid) { opts.push({label: "Yonko Commander Duel", weight: 30, pwr: 0}); opts.push({label: "Revolutionary Encounter", weight: 25, pwr: 0}); }
          else if (isLate) {
              opts.push({label: "Yonko Conflict", weight: 35, pwr: 0}); opts.push({label: "Revolutionary Encounter", weight: 25, pwr: 0}); opts.push({label: "Buster Call Operations", weight: 20, pwr: 0});
              let goalWeight = Math.max(0, (victoryCount - 4) * 30);
              if (goalWeight > 0) opts.push({label: "The Great Pirate Cleansing (FINAL GOAL)", weight: goalWeight, color: '#f59e0b', pwr: 0});
          }
      } 
      else if (currFac === "Revolutionary") {
          if (isEarly) { opts.push({label: "Liberate Island", weight: 30, pwr: 0}); opts.push({label: "Marine Ambush", weight: 25, pwr: 0}); opts.push({label: "Clash with Cipher Pol", weight: 20, pwr: 0}); }
          else if (isMid) { opts.push({label: "Clash with Cipher Pol", weight: 30, pwr: 0}); opts.push({label: "Admiral Ambush", weight: 25, pwr: 0}); }
          else if (isLate) {
              opts.push({label: "Admiral Ambush", weight: 35, pwr: 0}); opts.push({label: "Clash with Cipher Pol", weight: 30, pwr: 0});
              let goalWeight = Math.max(0, (victoryCount - 4) * 30);
              if (goalWeight > 0) opts.push({label: "Storm Mariejois (FINAL GOAL)", weight: goalWeight, color: '#f59e0b', pwr: 0});
          }
      } 
      else {
          if (isEarly) { opts.push({label: "Supernova Clash", weight: 30, pwr: 0}); opts.push({label: "Marine Ambush", weight: 20, pwr: 0}); }
          else if (isMid) { opts.push({label: "Yonko Commander Duel", weight: 30, pwr: 0}); opts.push({label: "Revolutionary Encounter", weight: 25, pwr: 0}); }
          else if (isLate) {
              opts.push({label: "Yonko Conflict", weight: 35, pwr: 0}); opts.push({label: "Admiral Ambush", weight: 25, pwr: 0});
              let goalWeight = Math.max(0, (victoryCount - 4) * 30);
              if (goalWeight > 0) opts.push({label: "Achieve Ultimate Dominance (FINAL GOAL)", weight: goalWeight, color: '#f59e0b', pwr: 0});
          }
      }
      
      return createStage("🗺️ The Journey", "Event", opts);
    }
    case 17: { // OBSŁUGA WYDARZEŃ
      let ev = characterState["Event"];

      // Rozpoczęcie Finałowej Wojny
      if (ev && ev.includes("FINAL GOAL")) {
          inFinalWar = true;
          stepIndex = 16; return getNextStage(); // Wraca do koła, ale nadpisze je koło Wojny
      }

      // Generowanie Bossa z Gauntletu (Krok wojny)
      if (ev && ev.startsWith("Face ")) {
          let g = getGauntlet(characterState["Faction"]);
          return createStage("👑 Final Legend", "Enemy", [{label: g[finalBossTier], weight: 100, color: '#dc2626'}]);
      }

      // Pokojowe wydarzenia
      let storyEvents = ["Discover Sunken Treasure", "Grand Banquet", "Navigate a Deadly Anomaly", "Meet a Legendary Mentor", "Recruit a Powerful Ally", "Discover an Ancient Ruin", "Underworld Auction"];
      if (storyEvents.includes(ev)) {
          if (ev === "Discover Sunken Treasure") totalBounty += 100000000;
          else if (ev === "Grand Banquet") totalBounty += 50000000;
          else if (ev === "Navigate a Deadly Anomaly") totalBounty += 80000000;
          else if (ev === "Recruit a Powerful Ally") totalBounty += 200000000;
          else if (ev === "Meet a Legendary Mentor") totalBounty += 300000000;
          else if (ev === "Discover an Ancient Ruin") totalBounty += 150000000;
          else if (ev === "Underworld Auction") totalBounty += 250000000;
          
          victoryCount++; updateStatusBar(); updateLiveSheet();
          stepIndex = 16; return getNextStage(); 
      }

      // Znaleziska w locie
      if (ev === "Haki Awakening") { 
          characterState["Haki Potential"] = "Two Colors (Obs & Arm)";
          characterState["Observation Haki"] = "Basic";
          characterState["Armament Haki"] = "Basic";
          totalBounty += 100000000;
          characterSheet.push({ key: "Observation Haki", val: "Basic" });
          characterSheet.push({ key: "Armament Haki", val: "Basic" });
          updateStatusBar(); updateLiveSheet();
          stepIndex = 16; return getNextStage(); 
      }
      if (ev === "Found a Mysterious Fruit") { stepIndex = 23; return getNextStage(); }
      
      // Trening
      if (ev === "Intense Training") { stepIndex = 21; return getNextStage(); }

      if (ev === "Liberate Island" || ev === "Search for Road Poneglyph") {
        totalBounty += 50000000; 
        if (ev === "Search for Road Poneglyph") { roadPoneglyphs++; victoryCount++; }
        updateStatusBar(); updateLiveSheet(); stepIndex = 16; return getNextStage();
      }

      // Generowanie zwykłego Wroga
      if (ev === "Clash with Warlord") return createStage("⚔️ Warlord", "Enemy", toWeighted(["Buggy the Clown", "Gecko Moria", "Bartholomew Kuma", "Sir Crocodile", "Donquixote Doflamingo", "Boa Hancock", "Trafalgar Law", "Edward Weevil", "Dracule Mihawk", "Jinbe"]));
      if (ev === "Marine Ambush" || ev === "Buster Call Operations") return createStage("⚓ Marines", "Enemy", toWeighted(["Vice Admiral Smoker", "Vice Admiral Momonga", "Captain Koby", "Admiral Fujitora", "Admiral Kizaru", "Admiral Aokiji", "Fleet Admiral Akainu", "Magellan"]));
      if (ev === "Admiral Ambush") return createStage("⚓ Admiral", "Enemy", toWeighted(["Admiral Ryokugyu", "Admiral Fujitora", "Admiral Kizaru", "Admiral Aokiji", "Fleet Admiral Akainu"]));
      if (ev === "Supernova Clash") return createStage("💥 Supernova", "Enemy", toWeighted(["Eustass Kid", "Killer", "Capone Bege", "Jewelry Bonney", "Basil Hawkins", "X Drake", "Scratchmen Apoo", "Urouge"]));
      if (ev === "Yonko Commander Duel" || ev === "Raid Pirate Crew" || ev === "Marine Fleet Ambush") return createStage("☠️ Commander", "Enemy", toWeighted(["Jack the Drought", "Cracker", "Smoothie", "Queen the Plague", "King the Wildfire", "Katakuri", "Marco the Phoenix", "Jozu", "Vista", "Shiryu of the Rain", "Lucky Roux", "Yasopp", "Benn Beckman"]));
      if (ev === "Yonko Conflict") return createStage("☠️ Yonko", "Enemy", toWeighted(["Emperor Buggy", "Blackbeard", "Big Mom", "Kaido", "Shanks"]));
      if (ev === "Clash with Cipher Pol") return createStage("🎭 Gov Agent", "Enemy", toWeighted(["Rob Lucci (CP0)", "Kaku (CP0)", "Stussy (CP0)", "Guernika (CP0)", "Maha (CP0)", "Joseph (CP0)", "Gismonda (CP0)", "Jabra", "Blueno", "Kalifa", "Kumadori", "Fukurou", "Spandam"]));
      if (ev === "Revolutionary Encounter") return createStage("🔥 Revolutionary", "Enemy", toWeighted(["Belo Betty", "Karasu", "Lindbergh", "Morley", "Emporio Ivankov", "Ginny", "Sabo (Flame Emperor)", "Monkey D. Dragon"]));

      stepIndex = 16; return getNextStage();
    }
    case 18: { // Walka survival kalkulacja
      if (characterState["Enemy"]) {
        enemyBounty = enemies[characterState["Enemy"]] || 1000000000;
        let scaledPwr = totalBounty / 1000000;
        let scaledEn = enemyBounty / 1000000;
        let winChance = Math.round((Math.pow(scaledPwr, 2) / (Math.pow(scaledPwr, 2) + Math.pow(scaledEn, 2))) * 100);
        winChance = Math.max(5, Math.min(95, winChance)); 
        return createStage("🩸 Battle Survival", "Outcome", [{label: "VICTORY", weight: winChance, color: '#16a34a'}, {label: "DEFEAT", weight: 100 - winChance, color: '#dc2626'}]);
      }
      stepIndex = 16; return getNextStage();
    }
    case 19: {
      let o = characterState["Outcome"];
      if (o === "VICTORY") {
         victoryCount++; updateLiveSheet();
         
         // Zwycięstwo w Gauntlecie!
         if (inFinalWar) {
             finalBossTier++;
             let g = getGauntlet(characterState["Faction"]);
             if (finalBossTier >= g.length) {
                 stepIndex = 26; return getNextStage(); // Przeszedł całą wojnę, KONIEC GRY
             } else {
                 totalBounty += 1000000000; // Haki Bloom za legendarnego bossa!
                 updateLiveSheet();
                 stepIndex = 16; return getNextStage(); // Powrót do menu Final War
             }
         } else {
             stepIndex = 16; return getNextStage(); 
         }
      } else {
         if (!hasEscaped) { stepIndex = 20; return getNextStage(); } 
         else { stepIndex = 26; return getNextStage(); } // Defeat final
      }
    }
    case 20: {
      return createStage("🏃 Desperate Escape", "Escape Attempt", [{label: "ESCAPED BARELY", weight: 20, color: '#eab308'}, {label: "CAPTURED / KILLED", weight: 80, color: '#dc2626'}]);
    }
    
    case 21: { // Koło Treningu
        let tOpts = [{label: "Strength", weight: 20, color: '#dc2626'}, {label: "Speed", weight: 20, color: '#2563eb'}, {label: "Battle IQ", weight: 20, color: '#16a34a'}];
        if (characterState["Weapon"] && characterState["Weapon"] !== "None") tOpts.push({label: "Weapon Mastery", weight: 20, color: '#f59e0b'});
        if (characterState["Fruit Category"] && characterState["Fruit Category"] !== "None") tOpts.push({label: "Fruit Mastery", weight: 20, color: '#db2777'});
        if (characterState["Observation Haki"]) tOpts.push({label: "Observation Haki", weight: 15, color: '#3b82f6'});
        if (characterState["Armament Haki"]) tOpts.push({label: "Armament Haki", weight: 15, color: '#16a34a'});
        if (characterState["Conqueror's Haki"]) tOpts.push({label: "Conqueror's Haki", weight: 10, color: '#f59e0b'});
        return createStage("🏋️ Train Which Stat?", "Trained Stat", tOpts);
    }
    case 22: { // Wynik Treningu
        return createStage("🎲 Training Outcome", "Training Outcome", [
            {label: "Huge Success! (+2 Tiers)", weight: 10, color: '#10b981'},
            {label: "Success! (+1 Tier)", weight: 50, color: '#3b82f6'},
            {label: "Partial Success (+Bounty)", weight: 30, color: '#f59e0b'},
            {label: "Training Failed", weight: 10, color: '#ef4444'}
        ]);
    }

    case 23: {
        return createStage("🍖 Eat Fruit", "Late Devil Fruit Cat", [{label: "Paramecia", weight: 40}, {label: "Zoan (Incl. Ancient)", weight: 30}, {label: "Logia", weight: 20}, {label: "Mythical Zoan", weight: 10}]);
    }
    case 24: {
        let cat = characterState["Late Devil Fruit Cat"];
        characterState["Fruit Category"] = cat; 
        let fList = cat === "Logia" ? opFruitsLogia : (cat === "Mythical Zoan" ? opFruitsMythical : (cat === "Zoan (Incl. Ancient)" ? opFruitsAncient.concat(opFruitsZoan) : opFruitsParamecia));
        
        characterState["Fruit Mastery"] = "Learning / Amateur";
        characterSheet.push({ key: "Fruit Mastery", val: "Learning / Amateur" });
        return createStage("🍎 Specific Fruit", "Late Devil Fruit", toWeighted(fList));
    }
    
    case 26: { // FINAL FATE
      if (characterState["Escape Attempt"] === "ESCAPED BARELY") {
         hasEscaped = true; characterState["Escape Attempt"] = ""; characterState["Outcome"] = "ESCAPED";
         stepIndex = 16; return getNextStage(); // Powrót na pętlę (wciąż trwa Final War)
      }
      let finO = characterState["Outcome"];
      if (finO !== "VICTORY" && finO !== "ESCAPED") return createStage("⛓️ Fate", "Final Status", [{label: "Defeated & Imprisoned in Impel Down", weight: 10, color: '#dc2626'}]);
      
      let finalFac = characterState["Faction"];
      if (finalFac === "Pirate") return createStage("⚓ Pirate Destiny", "Final Status", [{label: "Found One Piece & Became King of the Pirates!", weight: 10, color: '#16a34a'}]);
      else if (finalFac === "Marine") return createStage("🪖 Marine Destiny", "Final Status", [{label: "Eradicated the Yonko & Promoted to Fleet Admiral!", weight: 10, color: '#2563eb'}]);
      else if (finalFac === "Revolutionary") return createStage("🔥 Revolution Destiny", "Final Status", [{label: "Stormed Mariejois & Liberated the World!", weight: 10, color: '#9333ea'}]);
      else if (finalFac === "Tenryubito Overlord" || finalFac === "Holy Knight (God's Army)") return createStage("👑 Celestial Throne", "Final Status", [{label: "Secured Absolute Control Over Pangea Castle!", weight: 10, color: '#f59e0b'}]);
      else return createStage("⚡ Ultimate Destiny", "Final Status", [{label: "Achieved Absolute Dominance Over the Seas!", weight: 10, color: '#d97706'}]);
    }

    default: return null; 
  }
}

function drawWheel(stage) {
  const cvs = document.getElementById("wheelCanvas");
  if(!cvs) return;
  const ctx = cvs.getContext("2d");
  const items = stage.options;
  let totalWeight = items.reduce((sum, opt) => sum + opt.weight, 0);
  let cAngle = 0;
  ctx.clearRect(0, 0, 800, 800);
  items.forEach((item) => {
    let sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
    ctx.beginPath(); ctx.fillStyle = item.color; ctx.moveTo(400, 400); ctx.arc(400, 400, 390, cAngle, cAngle + sliceAngle); ctx.lineTo(400, 400); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.translate(400, 400); ctx.rotate(cAngle + sliceAngle / 2); ctx.textAlign = "right"; ctx.fillStyle = "#ffffff";
    if (sliceAngle < 0.08) ctx.font = "bold 9px sans-serif"; else if (sliceAngle < 0.15) ctx.font = "bold 12px sans-serif"; else if (sliceAngle < 0.3) ctx.font = "bold 15px sans-serif"; else ctx.font = "bold 20px sans-serif";
    ctx.shadowColor = "#000"; ctx.shadowBlur = 4; ctx.fillText(item.label, 370, 6, 250); ctx.restore();
    cAngle += sliceAngle;
  });
}

function spin() {
  initAudio();
  const btn = document.getElementById("spinBtn");
  btn.disabled = true;
  
  let randomDegrees = Math.floor(Math.random() * 360);
  currentRotation += 1800 + randomDegrees;
  
  const cvs = document.getElementById("wheelCanvas");
  
  let finalDeg = currentRotation % 360;
  let pointerAngle = (360 - finalDeg + 90) % 360;
  let tW = currentStage.options.reduce((s, o) => s + o.weight, 0), acc = 0, res = currentStage.options[currentStage.options.length - 1];
  for (let opt of currentStage.options) {
    let sA = (opt.weight / tW) * 360;
    if (pointerAngle >= acc && pointerAngle < acc + sA) { res = opt; break; }
    acc += sA;
  }

  isSpinning = true; lastTickSegment = -1; 
  trackSpinSound(currentRotation, performance.now(), 4500);

  cvs.style.transition = 'transform 4.5s cubic-bezier(0.12, 0.95, 0.2, 1)';
  cvs.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    handleResult(res);
  }, 4500);
}

function handleResult(res) {
  let popupTitle = res.label;
  
  if (currentStage.key === "Training Outcome") {
      let stat = characterState["Trained Stat"];
      let tiers = res.label.includes("+2") ? 2 : (res.label.includes("+1") ? 1 : 0);
      
      if (tiers > 0) {
          let upg = applyUpgrade(stat, tiers);
          popupTitle = upg.msg;
          totalBounty += upg.pwrDiff;
          characterState[upg.key] = upg.newLabel;
          let sheetItem = characterSheet.find(e => e.key === upg.key);
          if(sheetItem) sheetItem.val = upg.newLabel;
      } else if (res.label.includes("Partial")) {
          totalBounty += 50000000;
          popupTitle = "Gained 50,000,000 Bounty!";
      } else {
          popupTitle = "Training Failed. No improvements.";
      }
      stepIndex = 15; // Wraca do pętli morskiej
  } 
  else {
      characterState[currentStage.key] = res.label;
      const ignoreKeys = ["Enemy", "Outcome", "Event", "Escape Attempt", "Training Outcome", "Trained Stat", "Haki Potential", "Late Devil Fruit Cat", "Late Devil Fruit"];
      
      if (!ignoreKeys.includes(currentStage.key)) {
         let existingIndex = characterSheet.findIndex(e => e.key === currentStage.key);
         if(existingIndex !== -1) characterSheet[existingIndex].val = res.label;
         else characterSheet.push({ key: currentStage.key, val: res.label });
      }
      
      if (currentStage.key === "Late Devil Fruit") {
          characterState["Devil Fruit"] = res.label;
          characterSheet.push({ key: "Devil Fruit", val: res.label });
          stepIndex = 15; 
      }

      if (res.pwr) totalBounty += res.pwr;
  }
  
  let rd = document.getElementById("resultDisplay");
  if(rd) rd.innerText = res.label;
  
  updateStatusBar();
  updateLiveSheet();

  stepIndex++; 
  currentStage = getNextStage(); 

  setTimeout(() => {
    let pLabel = document.querySelector(".popup-title");
    if (pLabel) {
        let storyEvents = ["Discover Sunken Treasure", "Grand Banquet", "Navigate a Deadly Anomaly", "Meet a Legendary Mentor", "Recruit a Powerful Ally", "Discover an Ancient Ruin", "Underworld Auction"];
        if (currentStage && currentStage.key === "Training Outcome") pLabel.innerText = "Training Results:";
        else if (res.label === "Haki Awakening" || res.label === "Found a Mysterious Fruit") pLabel.innerText = "Rare Discovery!";
        else if (storyEvents.includes(res.label)) pLabel.innerText = "Event Completed!";
        else pLabel.innerText = "You Rolled:";
    }
    
    let pVal = document.getElementById("popupResultValue");
    if (pVal) pVal.innerText = popupTitle;

    let tnn = document.getElementById("transitionNextName");
    if (tnn) {
        if (currentStage) {
          if(currentStage.key === "Outcome") {
            let sP = totalBounty / 1000000;
            let sE = enemyBounty / 1000000;
            let winC = Math.max(5, Math.min(95, Math.round((Math.pow(sP, 2) / (Math.pow(sP, 2) + Math.pow(sE, 2))) * 100)));
            tnn.innerHTML = `<br>Win Chance vs ${characterState["Enemy"]}: <strong style="color:#f59e0b; font-size:1.2rem;">${winC}%</strong>`;
          } else {
            tnn.innerText = `Next up: ${currentStage.badge}`;
          }
        } else {
          tnn.innerText = `Journey Complete!`;
        }
    }
    
    let ts = document.getElementById("transitionScreen");
    if(ts) ts.classList.add("active");
  }, 1000);
}

function prepareNextStage() {
  let ts = document.getElementById("transitionScreen");
  if(ts) ts.classList.remove("active");
  
  if (!currentStage) return showFinalSummary();
  
  let sb = document.getElementById("stageBadge");
  if(sb) sb.innerText = currentStage.badge;
  
  let rd = document.getElementById("resultDisplay");
  if(rd) {
      if (currentStage.key === "Outcome") {
        rd.innerText = `Bounty: ${totalBounty.toLocaleString()} vs Threat: ${enemyBounty.toLocaleString()}`;
      } else {
        rd.innerText = "Spin!";
      }
  }
  
  const cvs = document.getElementById("wheelCanvas");
  if(cvs) {
      cvs.style.transition = 'none';
      cvs.style.transform = 'rotate(0deg)';
  }
  currentRotation = 0; 
  drawWheel(currentStage);
  
  setTimeout(() => {
    const btn = document.getElementById("spinBtn");
    if(btn) btn.disabled = false;
    if(cvs) {
        cvs.style.transition = 'transform 4.5s cubic-bezier(0.12, 0.95, 0.2, 1)';
    }
  }, 50);
}

function showFinalSummary() {
  let isGov = ["Tenryubito Overlord", "Holy Knight (God's Army)", "Marine"].includes(characterState["Faction"]);
  let isPirate = characterState["Faction"] === "Pirate";
  
  let html = `
    <div class="wanted-poster">
      <div class="wanted-title">${isGov ? "WORLD GOV DOSSIER" : "WANTED"}</div>
      ${isGov ? "" : '<div class="wanted-doa">DEAD OR ALIVE</div>'}
      <div style="margin: 20px 0;">`;
  
  characterSheet.forEach(i => {
    if (i.key === "Fruit Category" || i.key === "Final Status") return; 
    let shortKey = i.key.replace(" Haki", "");
    html += `<div class="card-row"><span class="card-label" style="color:#5c3a21;">${shortKey}</span><span class="card-val" style="color:#3e2723;">${i.val}</span></div>`;
  });
  
  html += `</div>
      <div class="wanted-bounty">
        <span style="font-size:1rem; color:#8b0000; display:block; margin-bottom:5px;">FINAL FATE:</span>
        <span style="font-size:1.3rem;">${characterState["Final Status"] || "Unknown"}</span>
      </div>
      ${isPirate ? `<div style="text-align:center; margin-top:10px; font-weight:bold; color:#5c3a21;">Road Poneglyphs Found: ${roadPoneglyphs}/4</div>` : ''}
    </div>`;
    
  let cc = document.getElementById("cardContainer");
  if(cc) cc.innerHTML = html;
  
  let sc = document.getElementById("summaryCard");
  if(sc) sc.classList.add("active");
  
  let live = document.getElementById("liveSheet");
  if(live) live.style.display = "none";
}

window.onload = () => {
  const sbtn = document.getElementById("spinBtn");
  if(sbtn) sbtn.addEventListener("click", spin);
  
  const cbtn = document.getElementById("continueBtn");
  if(cbtn) cbtn.addEventListener("click", prepareNextStage);
  
  const rbtn = document.getElementById("restartBtn");
  if(rbtn) rbtn.addEventListener("click", () => location.reload());

  updateStatusBar();
  currentStage = getNextStage(); 
  drawWheel(currentStage); 
  let sb = document.getElementById("stageBadge");
  if(sb) sb.innerText = currentStage.badge;
};
window.onload = () => {
  const sbtn = document.getElementById("spinBtn");
  if(sbtn) sbtn.addEventListener("click", spin);
  
  const cbtn = document.getElementById("continueBtn");
  if(cbtn) cbtn.addEventListener("click", prepareNextStage);
  
  const rbtn = document.getElementById("restartBtn");
  if(rbtn) rbtn.addEventListener("click", () => location.reload());

  updateStatusBar();
  updateLiveSheet(); // <-- Ta linijka rysuje list gończy od razu na starcie!
  currentStage = getNextStage(); 
  drawWheel(currentStage); 
  let sb = document.getElementById("stageBadge");
  if(sb) sb.innerText = currentStage.badge;
};