const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");

const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

const rightPack = document.getElementById("rightPack");
const leftPack = document.querySelector(".left-pack");
const inside = document.querySelector(".inside");

const cookieElements = Array.from(document.querySelectorAll(".cookie"));

let isOpened = false;
let cookieIndex = 0;

/* =========================
   LOGIN
========================= */
enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  if (passwordInput.value.trim().toUpperCase() === "BTSXSIEMPRE") {
    loginScreen.classList.add("hide-login");
    setTimeout(() => {
      loginScreen.style.display = "none";
      mainScene.classList.remove("hidden");
    }, 800);
  } else {
    errorText.innerText = "WRONG PASSWORD";
  }
}

/* =========================
   FASE 3 - ABRIR PACK (DRAG)
========================= */
let dragActive = false;
let dragStartX = 0;
let move = 0;

rightPack.addEventListener("pointerdown", startDrag);
window.addEventListener("pointermove", drag, { passive: false });
window.addEventListener("pointerup", stopDrag);
window.addEventListener("pointercancel", stopDrag);

function startDrag(e) {
  if (isOpened) return;
  dragActive = true;
  dragStartX = e.clientX;
  rightPack.style.transition = "none";
  rightPack.setPointerCapture?.(e.pointerId);
}

function drag(e) {
  if (!dragActive) return;

  move = e.clientX - dragStartX;
  if (move < 0) move = 0;
  if (move > 60) move = 60;

  updatePack(move);
  if (e.cancelable) e.preventDefault();
}

function stopDrag() {
  if (!dragActive) return;
  dragActive = false;

  if (move > 28) {
    isOpened = true;

    rightPack.style.transition = "transform 0.18s ease-out";
    updatePack(60);

    setTimeout(() => {
      rightPack.style.transform = `
        rotateZ(10deg)
        translateX(10px)
        translateY(6px)
      `;
    }, 120);

    setTimeout(() => {
      rightPack.style.transition =
        "transform 2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.5s";

      rightPack.style.transform = `
        rotateZ(25deg)
        translateX(30px)
        translateY(900px)
      `;

      setTimeout(() => {
        rightPack.style.opacity = "0";
        rightPack.style.display = "none";
      }, 1500);
    }, 260);
  } else {
    rightPack.style.transition = "transform .35s ease";
    updatePack(0);
  }
}

function updatePack(m) {
  const rotate = m * -0.15;

  rightPack.style.transform = `
    rotateZ(${rotate}deg)
    translateX(${m * 0.08}px)
  `;

  inside.style.width = `${m * 1.1}px`;
  inside.style.opacity = 0.2 + m / 120;
}

/* =========================
   FASE 3 - SPAWN COOKIES
   Click en pack izquierdo
========================= */
leftPack.addEventListener("click", spawnCookie);

function spawnCookie() {
  if (!isOpened) return;
  if (cookieIndex >= cookieElements.length) return;

  const cookie = cookieElements[cookieIndex];

  // limpiar pos anteriores por seguridad
  for (let i = 1; i <= 8; i++) cookie.classList.remove(`pos${i}`);

  cookie.classList.add("show");
  cookie.classList.add(`pos${cookieIndex + 1}`);

  cookieIndex++;
}

/* =========================
   NUEVO: ARMAR CAPAS TOP + INSIDE
   (sin cream CSS, sin frases JS)
========================= */

cookieElements.forEach((cookie) => {
  prepareCookieLayers(cookie);

  cookie.addEventListener("pointerdown", (e) => {
    if (!cookie.classList.contains("show")) return;
    if (cookie.classList.contains("open")) return;

    cookie.classList.add("open");

    if (e.cancelable) e.preventDefault();
  });
});

function prepareCookieLayers(cookie) {
  // si ya está armado, no duplicar
  if (cookie.querySelector(".cookie-top") || cookie.querySelector(".cookie-inside")) return;

  // data-img="galletitaX.png"
  const topFile = cookie.dataset.img;

  // sacar número X desde "galletitaX.png"
  const match = topFile && topFile.match(/(\d+)/);
  const num = match ? match[1] : null;

  // construir insideX.png
  const insideFile = num ? `inside${num}.png` : "inside1.png";

  const insideLayer = document.createElement("div");
  insideLayer.className = "cookie-inside";
  insideLayer.style.backgroundImage = `url("${insideFile}")`;

  const topLayer = document.createElement("div");
  topLayer.className = "cookie-top";
  topLayer.style.backgroundImage = `url("${topFile}")`;

  // orden: inside abajo, top arriba
  cookie.appendChild(insideLayer);
  cookie.appendChild(topLayer);
}
