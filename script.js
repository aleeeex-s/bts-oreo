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
passwordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword(){
  if (passwordInput.value === "BTSXSIEMPRE"){
    loginScreen.style.opacity = "0";
    setTimeout(() => {
      loginScreen.style.display = "none";
      mainScene.classList.remove("hidden");
    }, 700);
  } else {
    errorText.innerText = "WRONG PASSWORD";
  }
}

/* ========================= */
/* PAQUETE PRO ESTABLE */
/* ========================= */

let isDragging = false;
let isOpened = false;
let openProgress = 0;

const maxOpen = 90; // px visual

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", onDrag);
window.addEventListener("mouseup", endDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", onDrag);
window.addEventListener("touchend", endDrag);

function startDrag(e){
  if (isOpened) return;
  isDragging = true;
}

function onDrag(e){
  if (!isDragging || isOpened) return;

  const x = getX(e);
  const rect = rightPack.parentElement.getBoundingClientRect();

  // 🔥 normalizamos dentro del pack
  let progress = x - rect.left;

  if (progress < 0) progress = 0;
  if (progress > maxOpen) progress = maxOpen;

  openProgress = progress / maxOpen; // 0 → 1

  applyPack(openProgress);
}

function endDrag(){
  if (!isDragging) return;
  isDragging = false;

  if (openProgress > 0.35){
    openPack();
  } else {
    resetPack();
  }
}

function applyPack(p){
  const rotate = p * -18;
  const moveX = p * 18;

  rightPack.style.transform =
    `rotateZ(${rotate}deg) translateX(${moveX}px)`;

  inside.style.width = `${p * 100}px`;
  inside.style.opacity = 0.2 + (p * 0.6);
}

/* ========================= */
/* OPEN FINAL SEGURO */
/* ========================= */

function openPack(){
  isOpened = true;

  rightPack.style.transition = "transform 0.25s ease";

  rightPack.style.transform =
    `rotateZ(10deg) translateX(10px) translateY(5px)`;

  setTimeout(() => {
    rightPack.style.transition =
      "transform 1.6s cubic-bezier(.16,.72,.2,1), opacity 0.5s ease 1.2s";

    rightPack.style.transform =
      `rotateZ(25deg) translateX(30px) translateY(900px)`;

    setTimeout(() => {
      rightPack.style.opacity = "0";
    }, 1200);

  }, 200);
}

function resetPack(){
  openProgress = 0;

  rightPack.style.transition = "transform 0.25s ease";

  rightPack.style.transform = "rotateZ(0deg) translateX(0px)";
  inside.style.width = "0px";
  inside.style.opacity = "0.25";
}

function getX(e){
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* ========================= */
/* GALLETITAS (NO TOCADO) */
/* ========================= */

let cookieIndex = 0;

leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){
  if (!isOpened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show", `pos${cookieIndex + 1}`);
  cookieIndex++;
}
