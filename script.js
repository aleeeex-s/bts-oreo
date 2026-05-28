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
/* PAQUETE (FIX DEFINITIVO) */
/* ========================= */

let dragging = false;
let startX = 0;
let move = 0;
let opened = false;
let cookieIndex = 0;

rightPack.addEventListener("mousedown", start);
window.addEventListener("mousemove", movePack);
window.addEventListener("mouseup", end);

rightPack.addEventListener("touchstart", start);
window.addEventListener("touchmove", movePack);
window.addEventListener("touchend", end);

function start(e){
  if (opened) return;

  dragging = true;
  startX = getX(e);
}

function movePack(e){
  if (!dragging || opened) return;

  move = getX(e) - startX;

  if (move < 0) move = 0;
  if (move > 90) move = 90;

  const rotate = move * -0.2;

  rightPack.style.transform =
    `rotateZ(${rotate}deg) translateX(${move * 0.1}px)`;

  inside.style.width = `${move * 1.2}px`;
  inside.style.opacity = 0.2 + (move / 120);
}

function end(){
  if (!dragging) return;

  dragging = false;

  console.log("MOVE FINAL:", move); // 🔥 DEBUG CLAVE

  if (move > 25){
    openPack();
  } else {
    resetPack();
  }
}

function openPack(){
  opened = true;

  rightPack.style.transition = "transform 0.2s ease";

  rightPack.style.transform =
    `rotateZ(10deg) translateX(10px) translateY(5px)`;

  setTimeout(() => {
    rightPack.style.transition =
      "transform 1.8s cubic-bezier(.16,.72,.2,1), opacity 0.6s ease 1.2s";

    rightPack.style.transform =
      `rotateZ(25deg) translateX(25px) translateY(900px)`;

    setTimeout(() => {
      rightPack.style.opacity = "0";
    }, 1200);

  }, 200);
}

function resetPack(){
  rightPack.style.transition = "transform 0.3s ease";

  rightPack.style.transform = "rotateZ(0deg) translateX(0px)";
  inside.style.width = "0px";
  inside.style.opacity = "0.25";
}

function getX(e){
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* ========================= */
/* GALLETITAS */
/* ========================= */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){
  if (!opened) return;
  if (cookieIndex >= 8) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show", `pos${cookieIndex + 1}`);
  cookieIndex++;
}
