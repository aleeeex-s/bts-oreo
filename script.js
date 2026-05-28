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
window.addEventListener("pointermove", drag);
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

  // Evita scroll en touch
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
   click en pack izquierdo
========================= */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie() {
  if (!isOpened) return;
  if (cookieIndex >= cookieElements.length) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show");
  cookie.classList.add(`pos${cookieIndex + 1}`);

  // guardamos transform base ya con posX aplicado
  requestAnimationFrame(() => {
    cookie.dataset.baseTransform = getComputedStyle(cookie).transform;
  });

  cookieIndex++;
}

/* =========================
   FASE 4 - PREPARAR ESTRUCTURA
   (mitades + crema)
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

cookieElements.forEach((cookie, index) => {
  prepareCookieDOM(cookie, index);
  bindCookieOpenGesture(cookie, index);
});

function prepareCookieDOM(cookie, index) {
  // Si ya tiene halves/cream, no duplicar
  const hasHalves =
    cookie.querySelector(".cookie-half") && cookie.querySelector(".cream");
  if (hasHalves) return;

  // Intentar sacar imagen desde:
  // 1) data-img
  // 2) un <img> hijo
  // 3) background-image del .cookie
  let imgSrc =
    cookie.dataset.img ||
    cookie.getAttribute("data-img") ||
    (() => {
      const img = cookie.querySelector("img");
      return img ? img.src : "";
    })();

  if (!imgSrc) {
    const bg = getComputedStyle(cookie).backgroundImage;
    // bg puede venir como url("..."), intentamos usarlo tal cual
    if (bg && bg !== "none") imgSrc = bg;
  } else {
    imgSrc = `url("${imgSrc}")`;
  }

  // si había <img>, lo sacamos para que no moleste
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

/* =========================
   FASE 4 - GESTO CIRCULAR
   para abrir galletita
========================= */

function bindCookieOpenGesture(cookie, index) {
  let pressing = false;
  let lastAngle = 0;
  let progress = 0;
  let baseTransform = "none";

  cookie.addEventListener("pointerdown", startCircle);
  window.addEventListener("pointermove", moveCircle, { passive: false });
  window.addEventListener("pointerup", endCircle);
  window.addEventListener("pointercancel", endCircle);

  function startCircle(e) {
    if (!cookie.classList.contains("show")) return;
    if (cookie.classList.contains("open")) return;

    pressing = true;
    progress = 0;

    cookie.classList.add("interacting");

    // guardamos el transform base (con posX)
    baseTransform = cookie.dataset.baseTransform || getComputedStyle(cookie).transform;
    if (!cookie.dataset.baseTransform) cookie.dataset.baseTransform = baseTransform;

    const pos = getCookiePos(e, cookie);
    lastAngle = Math.atan2(pos.y, pos.x);

    cookie.setPointerCapture?.(e.pointerId);
  }

  function moveCircle(e) {
    if (!pressing) return;

    const pos = getCookiePos(e, cookie);
    const angle = Math.atan2(pos.y, pos.x);

    let delta = angle - lastAngle;

    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    progress += Math.abs(delta);
    lastAngle = angle;

    // escala suave mientras gira
    const scale = 1 + Math.min(progress * 0.03, 0.12);

    // mantenemos el transform base + escala (sin romper tus posX)
    const bt = baseTransform && baseTransform !== "none" ? baseTransform : "";
    cookie.style.transform = `${bt} scale(${scale})`;

    if (progress > 6) {
      activateCookie(cookie, index);
      pressing = false;
    }

    if (e.cancelable) e.preventDefault();
  }

  function endCircle() {
    if (!pressing) {
      // igual “normalizamos” por si quedó con escala
      if (!cookie.classList.contains("open")) {
        const bt = cookie.dataset.baseTransform && cookie.dataset.baseTransform !== "none"
          ? cookie.dataset.baseTransform
          : "";
        cookie.style.transform = bt;
        cookie.classList.remove("interacting");
      }
      return;
    }

    pressing = false;

    if (!cookie.classList.contains("open")) {
      const bt = cookie.dataset.baseTransform && cookie.dataset.baseTransform !== "none"
        ? cookie.dataset.baseTransform
        : "";
      cookie.style.transform = bt;
      cookie.classList.remove("interacting");
    }
  }
}

function getCookiePos(e, el) {
  const rect = el.getBoundingClientRect();

  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  return { x, y };
}

/* =========================
   ACTIVAR (ABRIR) COOKIE
========================= */

function activateCookie(cookie, index) {
  if (cookie.classList.contains("open")) return;

  cookie.classList.add("open");
  cookie.classList.remove("interacting");

  // asegurar texto en crema (por si cambiaste phrases)
  const cream = cookie.querySelector(".cream");
  if (cream) cream.textContent = phrases[index] || "";

  // vuelve a transform base (sin escala)
  const bt =
    cookie.dataset.baseTransform && cookie.dataset.baseTransform !== "none"
      ? cookie.dataset.baseTransform
      : "";
  cookie.style.transform = bt;

  // mini “pop” (sin romper translate)
  cookie.animate(
    [{ transform: `${bt}` }, { transform: `${bt} scale(1.06)` }, { transform: `${bt}` }],
    { duration: 450, easing: "ease-out" }
  );
}
