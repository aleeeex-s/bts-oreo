const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");
const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

const rightPack = document.getElementById("rightPack");
const leftPack = document.querySelector(".left-pack");
const inside = document.querySelector(".inside");

const cookieElements = document.querySelectorAll(".cookie");

/* LOGIN */
enterBtn.addEventListener("click", checkPassword);
passwordInput.addEventListener("keydown", e => {
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
  }
}

/* ========================= */
/* PAQUETE (FIX REAL) */
/* ========================= */

let isDragging = false;
let startX = 0;
let lastX = 0;
let openProgress = 0;   // 🔥 FIX: reemplaza currentRotation
let isOpened = false;
let cookieIndex = 0;

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag, { passive: true });
window.addEventListener("touchmove", drag, { passive: true });
window.addEventListener("touchend", stopDrag);

function startDrag(e){
  if (isOpened) return;

  isDragging = true;
  startX = getX(e);
  lastX = startX;

  rightPack.style.transition = "none";
}

function drag(e){
  if (!isDragging || isOpened) return;

  const x = getX(e);
  let delta = x - lastX;
  lastX = x;

  if (delta < 0) delta = 0;

  // 🔥 FIX CLAVE: acumulación estable
  openProgress += delta * 0.12;

  if (openProgress > 70) openProgress = 70;

  const rotate = openProgress * -0.18;

  rightPack.style.transform =
    `rotateZ(${rotate}deg) translateX(${openProgress * 0.08}px)`;

  inside.style.width = `${openProgress * 1.1}px`;
  inside.style.opacity = 0.2 + (openProgress / 140);
}

function stopDrag(){
  if (!isDragging) return;

  isDragging = false;

  if (openProgress > 28){
    openPack();
  } else {
    resetPack();
  }
}

function openPack(){
  isOpened = true;

  rightPack.style.transition = "transform 0.2s ease-out";

  rightPack.style.transform =
    `rotateZ(8deg) translateX(10px) translateY(6px)`;

  inside.style.width = "80px";
  inside.style.opacity = "0.6";

  setTimeout(() => {
    rightPack.style.transition =
      "transform 1.8s cubic-bezier(.16,.72,.2,1), opacity 0.6s ease 1.2s";

    rightPack.style.transform =
      `rotateZ(22deg) translateX(18px) translateY(850px)`;

    setTimeout(() => {
      rightPack.style.opacity = "0";
    }, 1200);

  }, 220);
}

function resetPack(){
  openProgress = 0;

  rightPack.style.transition = "transform 0.35s ease";
  rightPack.style.transform = "rotateZ(0deg) translateX(0px)";

  inside.style.width = "0px";
  inside.style.opacity = "0.25";
}

function getX(e){
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* GALLETITAS */
leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){
  if (!isOpened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show", `pos${cookieIndex + 1}`);
  cookieIndex++;
}

/* FASE 4 */
cookieElements.forEach((cookie, index) => {

  let isPressing = false;
  let lastAngle = 0;
  let progress = 0;

  cookie.addEventListener("mousedown", startCircle);
  cookie.addEventListener("touchstart", startCircle, { passive: true });

  window.addEventListener("mousemove", moveCircle);
  window.addEventListener("touchmove", moveCircle, { passive: true });

  window.addEventListener("mouseup", endCircle);
  window.addEventListener("touchend", endCircle);

  function startCircle(e){
    if (!cookie.classList.contains("show")) return;

    isPressing = true;
    progress = 0;

    const pos = getPos(e, cookie);
    lastAngle = Math.atan2(pos.y, pos.x);
  }

  function moveCircle(e){
    if (!isPressing) return;

    const pos = getPos(e, cookie);
    const angle = Math.atan2(pos.y, pos.x);

    let delta = angle - lastAngle;

    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    progress += Math.abs(delta);
    lastAngle = angle;

    const scale = 1 + Math.min(progress * 0.25, 0.3);

    cookie.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

    if (progress > 3.2){
      activateCookie(index);
      isPressing = false;
    }
  }

  function endCircle(){
    isPressing = false;
  }

  function getPos(e, el){
    const rect = el.getBoundingClientRect();

    const x = (e.touches ? e.touches[0].clientX : e.clientX)
      - rect.left - rect.width / 2;

    const y = (e.touches ? e.touches[0].clientY : e.clientY)
      - rect.top - rect.height / 2;

    return { x, y };
  }
});

/* ACTIVACIÓN FINAL */
function activateCookie(index){
  const cookie = cookieElements[index];

  cookie.classList.add("open");

  const phrases = [
    "Dulce energía",
    "Pequeño momento",
    "Crunch vibe",
    "Sweet break",
    "Oreo mood",
    "Mini felicidad",
    "Sabor BTS",
    "Enjoy"
  ];

  const text = document.createElement("div");
  text.className = "cookie-text";
  text.innerText = phrases[index];

  cookie.appendChild(text);
}
