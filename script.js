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

const levelStats = [
  { label: "Civilian", pwr: 0 }, { label: "East Blue Rookie", pwr: 5000000 }, { label: "Grand Line Pirate", pwr: 20000000 },
  { label: "Supernova Level", pwr: 100000000 }, { label: "Warlord Level", pwr: 250000000 }, { label: "Yonko Commander", pwr: 400000000 },
  { label: "Admiral Level", pwr: 700000000 }, { label: "Yonko Level", pwr: 1000000000 }, { label: "Pirate King Level", pwr: 1500000000 }
];

const masteryLevels = [
  { label: "No Talent", pwr: 0 }, { label: "Learning / Amateur", pwr: 10000000 }, { label: "Average", pwr: 30000000 },
  { label: "Skilled", pwr: 80000000 }, { label: "Expert", pwr: 200000000 }, { label: "Mastered", pwr: 400000000 }, { label: "Perfection", pwr: 800000000 }
];

const obsHakiLevels = [{ label: "Basic", pwr: 50000000 }, { label: "Intermediate", pwr: 150000000 }, { label: "Advanced (Future Sight)", pwr: 400000000 }, { label: "Mastered (Future Sight)", pwr: 1000000000 }];
const armHakiLevels = [{ label: "Basic", pwr: 50000000 }, { label: "Intermediate", pwr: 150000000 }, { label: "Advanced (Internal Dest.)", pwr: 400000000 }, { label: "Mastered (Internal Dest.)", pwr: 1000000000 }];
const conqHakiLevels = [{ label: "Basic", pwr: 100000000 }, { label: "Intermediate", pwr: 300000000 }, { label: "Advanced (ACoC)", pwr: 1000000000 }, { label: "Mastered (ACoC)", pwr: 2000000000 }];

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
  if (statName === "All Stats Maxed!") return { msg: "Absolute Pinnacle! (+100M Bounty)", pwrDiff: 100000000, key: "Peak", newLabel: "Peak" };

  let key = statName, arr;
  if(key === "Strength" || key === "Speed" || key === "Battle IQ") arr = levelStats;
  else if(key === "Weapon Mastery" || key === "Fruit Mastery") arr = masteryLevels;
  else if(key === "Observation Haki") arr = obsHakiLevels;
  else if(key === "Armament Haki") arr = armHakiLevels;
  else if(key === "Conqueror's Haki") arr =To bardzo trafne stwierdzenie, które można zinterpretować na kilka fascynujących sposobów, w zależności od tego, czy patrzymy na nie przez pryzmat wirtualnej rozrywki, czy filozofii. Zakładając, że to otwarta myśl, przyjrzyjmy się obu stronom.

### Perspektywa cyfrowa
W świecie gier wideo to w zasadzie złota zasada i fundament dzisiejszej rozrywki. Śmierć awatara rzadko oznacza definitywny koniec zabawy.

*   **Mechanika nauki i progresu:** W gatunkach takich jak *soulslike* czy *roguelike* (np. *Hades*, *Returnal*), porażka jest wręcz wpisana w mechanikę. Ekran "You Died" to nie koniec gry, ale kolejna lekcja, która pozwala wrócić silniejszym, mądrzejszym i lepiej przygotowanym.
*   **Systemy zapisu:** Ekran końcowy to najczęściej tylko krótka pauza przed wczytaniem ostatniego *checkpointu* i spróbowaniem innej taktyki.
*   **Fabuła w zaświatach:** Istnieje wiele tytułów, w których akcja toczy się właśnie po śmierci bohatera, a fizyczny koniec jest zaledwie punktem wyjścia dla głównej historii.

### Perspektywa życiowa i metaforyczna
Jeśli potraktujemy Twoje zdanie jako przenośnię odnoszącą się do prawdziwego życia, nabiera ono znacznie głębszego, refleksyjnego znaczenia:

*   **Dziedzictwo i wpływ:** Nawet gdy ktoś odchodzi, "gra" toczy się dalej dla tych, którzy zostali. Nasze czyny, stworzone dzieła i wpływ, jaki wywarliśmy na bliskich, nadal żyją i kształtują rzeczywistość.
*   **Przekonania duchowe:** Dla wielu kultur i systemów wierzeń fizyczna śmierć to jedynie przejście do innego etapu (np. życie pozagrobowe, reinkarnacja) – to swoista zmiana poziomu lub serwera, a nie wyciągnięcie wtyczki z gniazdka.

Niezależnie od tego, z jakiego kąta na to spojrzeć, to świetne i budujące hasło, które przypomina, by się nie poddawać po pierwszej porażce. 

Odwołujesz się do mechaniki jakiejś konkretnej gry, czy to raczej Twoja dzisiejsza refleksja nad życiem?