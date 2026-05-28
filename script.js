const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");
const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

const rightPack = document.getElementById("rightPack");
const leftPack = document.querySelector(".left-pack");
const inside = document.querySelector(".inside");

const cookieElements = document.querySelectorAll(".cookie");

/* ================================= */
/* LOGIN */
/* ================================= */

enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", e => {
if(e.key === "Enter"){
checkPassword();
}
});

function checkPassword(){

  if(passwordInput.value === "BTSXSIEMPRE"){

    loginScreen.style.opacity = "0";
  // Pasamos a mayúsculas para evitar problemas con el tipeo
  if(passwordInput.value.trim().toUpperCase() === "BTSXSIEMPRE"){
    
    // Agrega la clase que maneja la transición de opacidad
    loginScreen.classList.add("hide-login");

setTimeout(()=>{

loginScreen.style.display = "none";

      // Muestra la escena principal quitando el display: none
mainScene.classList.remove("hidden");

    },800);
    }, 800);

}else{

errorText.innerText = "WRONG PASSWORD";

}
}

@@ -61,29 +58,24 @@
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
rightPack.addEventListener("touchstart", startDrag, {passive: true});
window.addEventListener("touchmove", drag, {passive: false});
window.addEventListener("touchend", stopDrag);

/* START */

function startDrag(e){

if(isOpened) return;

isDragging = true;

startX = getX(e);

rightPack.style.transition = "none";
}

/* MOVE */

function drag(e){

if(!isDragging) return;

  
move = getX(e) - startX;

if(move < 0) move = 0;
@@ -95,121 +87,84 @@
/* END */

function stopDrag(){

if(!isDragging) return;

isDragging = false;

/* ABRIR */

if(move > 28){

isOpened = true;

/* APERTURA FINAL */

    rightPack.style.transition =
      "transform 0.18s ease-out";

    rightPack.style.transition = "transform 0.18s ease-out";
updatePack(60);

/* DESPEGUE */

setTimeout(()=>{

      rightPack.style.transform =
      `
      rightPack.style.transform = `
       rotateZ(10deg)
       translateX(10px)
       translateY(6px)
     `;

},120);

/* CAÍDA */

setTimeout(()=>{

      rightPack.style.transition =
      "transform 2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.5s";

      rightPack.style.transform =
      `
      rightPack.style.transition = "transform 2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.5s";
      rightPack.style.transform = `
       rotateZ(25deg)
       translateX(30px)
       translateY(900px)
     `;

setTimeout(()=>{

rightPack.style.opacity = "0";

        rightPack.style.display = "none"; // Elimina el elemento para que no bloquee clicks
},1500);

},260);

}else{

/* CERRAR */

    rightPack.style.transition =
      "transform 0.35s ease";

    rightPack.style.transition = "transform 0.35s ease";
updatePack(0);
}
}

/* UPDATE */

function updatePack(m){

const rotate = m * -0.15;

  rightPack.style.transform =
  `
  rightPack.style.transform = `
   rotateZ(${rotate}deg)
   translateX(${m * 0.08}px)
 `;

  inside.style.width =
    `${m * 1.1}px`;

  inside.style.opacity =
    0.2 + (m / 120);
  if(inside) {
    // Sincronizado en píxeles según tu diseño original
    inside.style.width = `${m * 1.1}px`; 
    inside.style.opacity = 0.2 + (m / 120);
  }
}

/* GET X */

function getX(e){

  return e.touches
    ? e.touches[0].clientX
    : e.clientX;
  return e.touches ? e.touches[0].clientX : e.clientX;
}

/* ================================= */
/* GALLETITAS */
/* ================================= */

leftPack.addEventListener(
  "click",
  spawnCookie
);
leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){

if(!isOpened) return;
  if(cookieIndex >= cookieElements.length) return;

  if(cookieIndex >= 8) return;

  const cookie =
    cookieElements[cookieIndex];

  const cookie = cookieElements[cookieIndex];
cookie.classList.add("show");

  cookie.classList.add(
    `pos${cookieIndex + 1}`
  );
  cookie.classList.add(`pos${cookieIndex + 1}`);

cookieIndex++;
}
@@ -220,111 +175,64 @@
/* ================================= */

cookieElements.forEach((cookie,index)=>{

let isPressing = false;

let lastAngle = 0;

let progress = 0;

  cookie.addEventListener(
    "mousedown",
    startCircle
  );

  cookie.addEventListener(
    "touchstart",
    startCircle
  );

  window.addEventListener(
    "mousemove",
    moveCircle
  );

  window.addEventListener(
    "touchmove",
    moveCircle
  );

  window.addEventListener(
    "mouseup",
    endCircle
  );

  window.addEventListener(
    "touchend",
    endCircle
  );
  cookie.addEventListener("mousedown", startCircle);
  cookie.addEventListener("touchstart", startCircle, {passive: true});
  window.addEventListener("mousemove", moveCircle);
  window.addEventListener("touchmove", moveCircle, {passive: false});
  window.addEventListener("mouseup", endCircle);
  window.addEventListener("touchend", endCircle);

function startCircle(e){

    if(!cookie.classList.contains("show"))
      return;

    if(cookie.classList.contains("open"))
      return;
    if(!cookie.classList.contains("show")) return;
    if(cookie.classList.contains("open")) return;

isPressing = true;

progress = 0;

const pos = getCookiePos(e,cookie);

    lastAngle =
      Math.atan2(pos.y,pos.x);
    lastAngle = Math.atan2(pos.y,pos.x);
}

function moveCircle(e){

if(!isPressing) return;

    const pos =
      getCookiePos(e,cookie);

    const angle =
      Math.atan2(pos.y,pos.x);

    let delta =
      angle - lastAngle;

    if(delta > Math.PI)
      delta -= Math.PI * 2;
    const pos = getCookiePos(e,cookie);
    const angle = Math.atan2(pos.y,pos.x);
    let delta = angle - lastAngle;

    if(delta < -Math.PI)
      delta += Math.PI * 2;
    if(delta > Math.PI) delta -= Math.PI * 2;
    if(delta < -Math.PI) delta += Math.PI * 2;

progress += Math.abs(delta);

lastAngle = angle;

/* feedback visual */
    const scale = 1 + Math.min(progress * 0.03, 0.12);

    const scale =
      1 + Math.min(progress * 0.03,0.12);

    cookie.style.filter =
      `
    cookie.style.filter = `
     brightness(${1 + progress * 0.03})
     drop-shadow(0 0 25px rgba(255,255,255,0.35))
      `;

    cookie.style.transform +=
      ` scale(${scale})`;
    `;
    
    // Mantiene la posición original de la clase e incrementa escala temporal
    cookie.style.transform = window.getComputedStyle(cookie).transform + ` scale(${scale})`;

/* ACTIVAR */

if(progress > 6){

activateCookie(cookie,index);

isPressing = false;
}
}

function endCircle(){

isPressing = false;
    if(!cookie.classList.contains("open")) {
      cookie.style.filter = "";
    }
}
});

@@ -333,24 +241,9 @@
/* ================================= */

function getCookiePos(e,el){

  const rect =
    el.getBoundingClientRect();

  const x =
    (e.touches
      ? e.touches[0].clientX
      : e.clientX)
    - rect.left
    - rect.width / 2;

  const y =
    (e.touches
      ? e.touches[0].clientY
      : e.clientY)
    - rect.top
    - rect.height / 2;

  const rect = el.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - rect.width / 2;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - rect.height / 2;
return {x,y};
}

@@ -360,61 +253,26 @@
/* ================================= */

function activateCookie(cookie,index){

  if(cookie.classList.contains("open")) return;
cookie.classList.add("open");

/* TEXTO */

const phrases = [

    "Dulce energía",
    "Golden hour",
    "Stay soft",
    "Purple soul",
    "Shine more",
    "Sweet vibes",
    "BTS forever",
    "Enjoy moment"

    "Dulce energía", "Golden hour", "Stay soft", "Purple soul",
    "Shine more", "Sweet vibes", "BTS forever", "Enjoy moment"
];

  const text =
    document.createElement("div");

  text.className =
    "cookie-text";

  text.innerText =
    phrases[index];

  const text = document.createElement("div");
  text.className = "cookie-text";
  text.innerText = phrases[index];
cookie.appendChild(text);

/* ANIMACIÓN */

  cookie.animate(

    [

      {
        transform:
          "translateY(-50%) scale(1)"
      },

      {
        transform:
          "translateY(-50%) scale(1.08)"
      },

      {
        transform:
          "translateY(-50%) scale(1)"
      }

    ],

    {
      duration:500
    }

  );
  cookie.animate([
    { transform: "translateY(-50%) scale(1)" },
    { transform: "translateY(-50%) scale(1.08)" },
    { transform: "translateY(-50%) scale(1)" }
  ], {
    duration: 500
  });
}
