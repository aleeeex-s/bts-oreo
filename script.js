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

  // Por las dudas, limpiamos pos anteriores
  for (let i = 1; i <= 8; i++) cookie.classList.remove(`pos${i}`);

  cookie.classList.add("show");
  cookie.classList.add(`pos${cookieIndex + 1}`);

  cookieIndex++;
}

/* =========================
   FASE 4 - CLICK/TAP PARA ABRIR
========================= */
const phrases = [
  "Dulce energía",
  "Golden hour",
  "Stay soft",
  "Purple soul",
  "Shine more",
  "Sweet vibes",
  "BTS forever",
  "Enjoy moment",
];

// Prepara DOM de cada cookie (mitades + crema) y bind del click
cookieElements.forEach((cookie, index) => {
  prepareCookieDOM(cookie, index);

  cookie.addEventListener("pointerdown", (e) => {
    // solo si está visible
    if (!cookie.classList.contains("show")) return;

    // si ya está abierta, no hacemos nada (o podrías cerrarla si querés)
    if (cookie.classList.contains("open")) return;

    openCookie(cookie, index);

    // evita "doble tap zoom" / scroll raro en móvil
    if (e.cancelable) e.preventDefault();
  });
});

function prepareCookieDOM(cookie, index) {
  // Si ya existe, no duplicar
  const hasHalves =
    cookie.querySelector(".cookie-half") && cookie.querySelector(".cream");
  if (hasHalves) return;

  // Intentar encontrar imagen de la galletita
  let imgSrc =
    cookie.dataset.img ||
    cookie.getAttribute("data-img") ||
    (() => {
      const img = cookie.querySelector("img");
      return img ? img.src : "";
    })();

  if (!imgSrc) {
    const bg = getComputedStyle(cookie).backgroundImage;
    if (bg && bg !== "none") imgSrc = bg; // ya viene como url(...)
  } else {
    imgSrc = `url("${imgSrc}")`;
  }

  // Si había <img>, lo quitamos para que no moleste
  const childImg = cookie.querySelector("img");
  if (childImg) childImg.remove();

  const top = document.createElement("div");
  top.className = "cookie-half top-half";
  top.style.backgroundImage = imgSrc;

  const bottom = document.createElement("div");
  bottom.className = "cookie-half bottom-half";
  bottom.style.backgroundImage = imgSrc;

  const cream = document.createElement("div");
  cream.className = "cream";
  cream.textContent = phrases[index] || "";

  cookie.appendChild(bottom);
  cookie.appendChild(cream);
  cookie.appendChild(top);
}

function openCookie(cookie, index) {
  cookie.classList.add("open");

  const cream = cookie.querySelector(".cream");
  if (cream) cream.textContent = phrases[index] || "";

  // mini pop
  cookie.animate(
    [{ transform: "" }, { transform: "scale(1.05)" }, { transform: "" }],
    { duration: 380, easing: "ease-out" }
  );
}
