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
========================= */
leftPack.addEventListener("click", spawnCookie);

function spawnCookie() {
  if (!isOpened) return;
  if (cookieIndex >= cookieElements.length) return;

  const cookie = cookieElements[cookieIndex];

  // por las dudas: limpiar pos viejas
  for (let i = 1; i <= 8; i++) cookie.classList.remove(`pos${i}`);

  cookie.classList.add("show");
  cookie.classList.add(`pos${cookieIndex + 1}`);

  // reset escala variable
  cookie.style.setProperty("--s", "1");

  cookieIndex++;
}

/* =========================
   FASE 4 - DOM (MITADES + CREMA)
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
  const hasHalves =
    cookie.querySelector(".cookie-half") && cookie.querySelector(".cream");
  if (hasHalves) return;

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
   (SIN tocar transform)
========================= */
function bindCookieOpenGesture(cookie, index) {
  let pressing = false;
  let lastAngle = 0;
  let progress = 0;

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
    cookie.style.setProperty("--s", "1");

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

    const scale = 1 + Math.min(progress * 0.03, 0.12);
    cookie.style.setProperty("--s", String(scale));

    if (progress > 6) {
      activateCookie(cookie, index);
      pressing = false;
    }

    if (e.cancelable) e.preventDefault();
  }

  function endCircle() {
    if (!pressing) {
      if (!cookie.classList.contains("open")) {
        cookie.style.setProperty("--s", "1");
        cookie.classList.remove("interacting");
      }
      return;
    }

    pressing = false;

    if (!cookie.classList.contains("open")) {
      cookie.style.setProperty("--s", "1");
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

function activateCookie(cookie, index) {
  if (cookie.classList.contains("open")) return;

  cookie.classList.add("open");
  cookie.classList.remove("interacting");
  cookie.style.setProperty("--s", "1");

  const cream = cookie.querySelector(".cream");
  if (cream) cream.textContent = phrases[index] || "";

  // pequeño “pop” con variable
  cookie.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
    { duration: 420, easing: "ease-out" }
  );
}
