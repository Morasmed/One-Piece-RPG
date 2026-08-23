function spin() {
  initAudio();
  const btn = document.getElementById("spinBtn");
  if (btn) btn.disabled = true;
  
  let randomDegrees = Math.floor(Math.random() * 360);
  currentRotation += 1800 + randomDegrees;
  
  const cvs = document.getElementById("wheelCanvas");
  if (!cvs) return;
  
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

  // --- TWARDE WYMUSZENIE ANIMACJI ---
  // Najpierw wyłączamy przejście i zmuszamy przeglądarkę do przeliczenia ekranu (reflow)
  cvs.style.transition = 'none';
  void cvs.offsetWidth; 
  
  // Dopiero teraz narzucamy płynną animację kręcenia
  cvs.style.transition = 'transform 4.5s cubic-bezier(0.12, 0.95, 0.2, 1)';
  cvs.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    isSpinning = false;
    handleResult(res);
  }, 4500);
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
      // Resetujemy koło natychmiast i bez animacji
      cvs.style.transition = 'none';
      cvs.style.transform = 'rotate(0deg)';
      void cvs.offsetWidth; // Wymuszenie reflow po resecie
  }
  
  currentRotation = 0; 
  drawWheel(currentStage);
  
  setTimeout(() => {
    const btn = document.getElementById("spinBtn");
    if(btn) btn.disabled = false;
  }, 50);
}