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

function checkPassword(){
  if (passwordInput.value === "BTSXSIEMPRE") {
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
/* PAQUETE (ESTABLE) */
/* ========================= */

let isDragging = false;
let startX = 0;
let move = 0;
let isOpened = false;
let cookieIndex = 0;

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e){
  if (isOpened) return;
  isDragging = true;
  startX = getX(e);
}

function drag(e){
  if (!isDragging) return;

  move = getX(e) - startX;

  if (move < 0) move = 0;
  if (move > 60) move = 60;

  updatePack(move);
}

function stopDrag(){
  if (!isDragging) return;
  isDragging = false;

  if (move > 28){
    isOpened = true;
  } else {
    updatePack(0);
  }
}

function updatePack(m){
  const rotate = m * -0.15;

  rightPack.style.transform =
    `rotateZ(${rotate}deg) translateX(${m * 0.08}px)`;

  inside.style.width = `${m * 1.1}px`;
  inside.style.opacity = 0.2 + (m / 120);
}

function getX(e){
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* ========================= */
/* GALLETITAS */
/* ========================= */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){
  if (!isOpened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show", `pos${cookieIndex + 1}`);

  cookieIndex++;
}
