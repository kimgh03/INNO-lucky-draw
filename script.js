const prizes = [
  "Draft Beer 450ml",
  "Draft Beer 270ml",
  "Melon Sour",
  "Purple Rain",
  "Jin Tonic",
];

const stateKey = "innoLuckyDrawState";
const confirmButton = document.querySelector("#confirmButton");
const drawPanel = document.querySelector("#drawPanel");
const spinButton = document.querySelector("#spinButton");
const chanceStatus = document.querySelector("#chanceStatus");
const chanceBadge = document.querySelector("#chanceBadge");
const wheel = document.querySelector("#wheel");
const resultCard = document.querySelector("#resultCard");
const resultText = document.querySelector("#resultText");

let currentRotation = 0;
let state = loadState();

render();

confirmButton.addEventListener("click", () => {
  state = {
    verified: true,
    used: false,
    prize: "",
  };
  saveState();
  render();
});

spinButton.addEventListener("click", () => {
  if (!state.verified || state.used || spinButton.disabled) return;

  const prizeIndex = Math.floor(Math.random() * prizes.length);
  const segmentSize = 360 / prizes.length;
  const segmentCenter = prizeIndex * segmentSize + segmentSize / 2;
  const targetAtPointer = 360 - segmentCenter;
  const extraTurns = 5 + Math.floor(Math.random() * 2);

  currentRotation += extraTurns * 360 + targetAtPointer;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  spinButton.disabled = true;
  spinButton.textContent = "Drawing...";
  chanceStatus.textContent = "룰렛이 돌아가는 중입니다.";

  window.setTimeout(() => {
    state = {
      verified: true,
      used: true,
      prize: prizes[prizeIndex],
    };
    saveState();
    render();
  }, 4300);
});

function render() {
  drawPanel.classList.toggle("is-locked", !state.verified);
  drawPanel.classList.toggle("is-ready", state.verified && !state.used);
  drawPanel.classList.toggle("is-complete", state.used);

  if (!state.verified) {
    confirmButton.disabled = false;
    confirmButton.textContent = "Staff Confirmed: Yes";
    spinButton.disabled = true;
    spinButton.textContent = "Start Lucky Draw";
    chanceBadge.textContent = "Locked";
    chanceStatus.textContent = "직원 확인 후 룰렛 기회가 열립니다.";
    resultCard.hidden = true;
    return;
  }

  confirmButton.disabled = true;
  confirmButton.textContent = "Staff Confirmed";

  if (!state.used) {
    spinButton.disabled = false;
    spinButton.textContent = "Start Lucky Draw";
    chanceBadge.textContent = "1 Chance";
    chanceStatus.textContent = "룰렛 기회가 생겼습니다.";
    resultCard.hidden = true;
    return;
  }

  spinButton.disabled = true;
  spinButton.textContent = "Coupon Issued";
  chanceBadge.textContent = "Complete";
  chanceStatus.textContent = "무료 음료 쿠폰이 발급되었습니다.";
  resultText.textContent = state.prize;
  resultCard.hidden = false;
}

function loadState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(stateKey));
    if (saved && typeof saved === "object") {
      return {
        verified: Boolean(saved.verified),
        used: Boolean(saved.used),
        prize: prizes.includes(saved.prize) ? saved.prize : "",
      };
    }
  } catch {
    window.localStorage.removeItem(stateKey);
  }

  return {
    verified: false,
    used: false,
    prize: "",
  };
}

function saveState() {
  window.localStorage.setItem(stateKey, JSON.stringify(state));
}
