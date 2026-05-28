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

/* DRAG EVENTS */

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
/* GALLETITAS */
/* ========================= */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie() {
  if (!isOpened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show");
  cookie.classList.add(`pos${cookieIndex + 1}`);

  cookieIndex++;
}

/* ========================= */
/* FASE 3: GESTO CIRCULAR */
/* ========================= */

cookieElements.forEach((cookie, index) => {

  let isPressing = false;
  let lastAngle = 0;

  cookie.addEventListener("mousedown", startCircle);
  cookie.addEventListener("touchstart", startCircle);

  window.addEventListener("mousemove", moveCircle);
  window.addEventListener("touchmove", moveCircle);

  window.addEventListener("mouseup", endCircle);
  window.addEventListener("touchend", endCircle);

  function startCircle(e) {
    if (!cookie.classList.contains("show")) return;

    isPressing = true;

    const pos = getPos(e, cookie);
    lastAngle = Math.atan2(pos.y, pos.x);

    e.stopPropagation();
  }

  function moveCircle(e) {
    if (!isPressing) return;

    const pos = getPos(e, cookie);
    const angle = Math.atan2(pos.y, pos.x);

    let delta = angle - lastAngle;

    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    const progress = Math.abs(delta);

    cookie.dataset.progress = (parseFloat(cookie.dataset.progress || 0) + progress);

    lastAngle = angle;

    const p = parseFloat(cookie.dataset.progress);

    cookie.style.transform += ` scale(${1 + Math.min(p / 6, 0.25)})`;

    if (p > 4) {
      activateCookie(index);
      isPressing = false;
    }

    e.stopPropagation();
  }

  function endCircle() {
    isPressing = false;
  }

  function getPos(e, el) {
    const rect = el.getBoundingClientRect();

    const x = (e.touches ? e.touches[0].clientX : e.clientX)
      - rect.left - rect.width / 2;

    const y = (e.touches ? e.touches[0].clientY : e.clientY)
      - rect.top - rect.height / 2;

    return { x, y };
  }
});

/* ACTIVACIÓN */
function activateCookie(index) {
  const cookie = cookieElements[index];

  cookie.style.transition = "transform 0.6s ease, opacity 0.6s ease";
  cookie.style.transform += " scale(1.4) rotate(10deg)";
}
