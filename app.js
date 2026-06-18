function toggleSettings() {
  const p = document.getElementById("settings");
  p.style.display = p.style.display === "block" ? "none" : "block";
}

function toggleTheme() {
  const b = document.body;
  const isLight = b.getAttribute("data-theme") === "light";
  b.setAttribute("data-theme", isLight ? "dark" : "light");
  document.getElementById("themeBtn").innerText = isLight ? "☀️" : "🌙";
}

function initialize() {
  const stored = localStorage.getItem("worktime");
  if (stored) {
    const json = JSON.parse(stored);
    document.getElementById("targetTime").value = json.targetTime || "07:12";
    document.getElementById("pausaMinTime").value = json.pausaMinTime || "00:30";
    document.getElementById("eM").value = json.eM || "00:00";
    document.getElementById("uM").value = json.uM || "00:00";
    document.getElementById("eP").value = json.eP || "00:00";
  } else {
    document.getElementById("targetTime").value = "07:12";
    document.getElementById("pausaMinTime").value = "00:30";
    document.getElementById("eM").value = "00:00";
    document.getElementById("uM").value = "00:00";
    document.getElementById("eP").value = "00:00";
  }
}

function update(target, pausamin, em, um, ep){
  const totext = (value) => {
    if(!value) return 0;
    ora = Math.floor(value / 60) % 24;
    minuti = Math.round(value % 60);
    return `${ora.toString().padStart(2, "0")}-${minuti.toString().padStart(2, "0")}`;
  }

  const json = {
    eM: totext(em),
    uM: totext(um),
    eP: totext(ep),
    targetTime: totext(target),
    pausaMinTime: totext(pausamin)
  };

  localStorage.setItem("worktime", JSON.stringify(json), null, 2);
}

function calcola() {
  const toMin = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const eM = toMin(document.getElementById("eM").value);
  const uM = toMin(document.getElementById("uM").value);
  let eP = toMin(document.getElementById("eP").value);
  const targetMin = toMin(document.getElementById("targetTime").value);
  const pausaMinTarget = toMin(document.getElementById("pausaMinTime").value);
  let result = "--:--";

  if(eM === 0 && uM === 0 && eP === 0) {
    result = "--:--";
    res.innerText = result;
    return;
  }

  const warn = document.getElementById("warn");
  const res = document.getElementById("res");

  if (uM > 0 && pausaMinTarget > 0 && eP - uM < pausaMinTarget) {
    warn.innerText = `⚠️ Pausa minima ${document.getElementById("pausaMinTime").value} non rispettata e aggiunta per default`;
    warn.style.display = "block";
    eP = uM + pausaMinTarget;
    update(targetTime, pausaMinTarget, eM, uM, eP)
    initialize();
    return;
  } else {
    warn.style.display = "none";
  }

  const lavoratoMattina = uM - eM;
  const daLavorare = targetMin - lavoratoMattina;

  if (daLavorare <= 0) {
    res.innerText = "OK!";
    return;
  }

  const uscitaMin = eP + daLavorare ;
  const hU = Math.floor(uscitaMin / 60) % 24;
  const mU = Math.round(uscitaMin % 60);
  result = `${hU.toString().padStart(2, "0")}:${mU.toString().padStart(2, "0")}`;  
  res.innerText = result;

  update(targetTime, pausaMinTarget, eM, uM, eP);
  initialize();
}

initialize();
calcola();