const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");
const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

const rightPack = document.getElementById("rightPack");
const leftPack = document.querySelector(".left-pack");
const inside = document.querySelector(".inside");

const cookieElements = document.querySelectorAll(".cookie");

/* ========================= */
/* LOGIN */
/* ========================= */

enterBtn.addEventListener("click", checkPassword);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  const password = passwordInput.value;

  if (password === "BTSXSIEMPRE") {
    loginScreen.style.opacity = "0";

    setTimeout(() => {
      loginScreen.style.display = "none";
      mainScene.classList.remove("hidden");
    }, 800);
  } else {
    errorText.innerText = "WRONG PASSWORD";

    loginScreen.animate(
      [
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0px)" }
      ],
      { duration: 400 }
    );
  }
}

/* ========================= */
/* PAQUETE */
/* ========================= */

let isDragging = false;
let startX = 0;
let currentRotation = 0;
let isOpened = false;
let cookieIndex = 0;

/* ========================= */
/* ESTADO FASE 3 PRO */
/* ========================= */

const cookieState = new Map();

cookieElements.forEach((cookie) => {
  cookieState.set(cookie, {
    active: false,
    points: [],
    progress: 0,
    opened: false
  });
});

/* ========================= */
/* DRAG PAQUETE */
/* ========================= */

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e) {
  if (isOpened) return;

  isDragging = true;
  startX = getX(e);
  rightPack.style.transition = "none";
}

function drag(e) {
  if (!isDragging) return;

  let currentX = getX(e);
  let move = currentX - startX;

  if (move < 0) move = 0;
  if (move > 60) move = 60;

  currentRotation = move;
  updatePack(move);
}

function stopDrag() {
  if (!isDragging) return;

  isDragging = false;

  if (currentRotation > 28) {
    isOpened = true;

    rightPack.style.cursor = "default";
    rightPack.style.transition = "transform 0.16s ease-out";

    updatePack(60);

    setTimeout(() => {
      rightPack.style.transform =
        `rotateZ(8deg) translateX(8px) translateY(6px)`;
    }, 100);

    setTimeout(() => {
      rightPack.classList.add("falling");

      rightPack.style.transition =
        "transform 2.2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.8s";

      rightPack.style.transform =
        `rotateZ(22deg) translateX(18px) translateY(850px)`;

      setTimeout(() => {
        rightPack.style.opacity = "0";
      }, 1800);
    }, 260);

  } else {
    rightPack.style.transition = "transform 0.35s ease";
    updatePack(0);
  }
}

function updatePack(move) {
  let rotate = move * -0.15;

  rightPack.style.transform =
    `rotateZ(${rotate}deg) translateX(${move * 0.08}px)`;

  inside.style.width = `${move * 1.1}px`;
  inside.style.opacity = 0.2 + (move / 120);
}

function getX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* ========================= */
/* SPAWN GALLETITAS */
/* ========================= */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie() {
  if (!isOpened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show");

  cookieIndex++;
}

/* ========================= */
/* FASE 3 PRO - INTERACCIÓN CIRCULAR */
/* ========================= */

document.addEventListener("pointerdown", (e) => {
  const el = document.elementFromPoint(e.clientX, e.clientY);

  if (!el || !el.classList.contains("cookie")) return;

  const state = cookieState.get(el);
  if (!state) return;

  state.active = true;
  state.points = [];
});

document.addEventListener("pointermove", (e) => {
  cookieState.forEach((state, cookie) => {
    if (!state.active) return;

    state.points.push({ x: e.clientX, y: e.clientY });

    if (state.points.length > 10) {
      detectCircularMotion(state, cookie);
    }
  });
});

document.addEventListener("pointerup", () => {
  cookieState.forEach((state) => {
    state.active = false;
    state.points = [];
  });
});

function detectCircularMotion(state, cookie) {
  const pts = state.points;

  const p1 = pts[0];
  const p2 = pts[Math.floor(pts.length / 2)];
  const p3 = pts[pts.length - 1];

  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const cross = v1.x * v2.y - v1.y * v2.x;
  const movement = Math.hypot(v2.x, v2.y);

  if (movement > 5) {
    state.progress += Math.abs(cross) * 0.002;
  }

  state.progress = Math.min(state.progress, 1);

  cookie.style.filter = `
    brightness(${1 + state.progress * 0.6})
    drop-shadow(0 0 ${state.progress * 20}px rgba(140,70,255,0.6))
  `;

  if (state.progress >= 1 && !state.opened) {
    openCookie(cookie, state);
  }
}

function openCookie(cookie, state) {
  state.opened = true;

  cookie.classList.add("opened");

  cookie.style.transition = "0.6s ease";
  cookie.style.transform = "scale(1.25)";
  cookie.style.filter = "brightness(1.4)";
}
