const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");

const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

const rightPack = document.getElementById("rightPack");
const leftPack = document.querySelector(".left-pack");
const inside = document.querySelector(".inside");

const cookieElements = document.querySelectorAll(".cookie");

let isDragging = false;
let startX = 0;
let move = 0;
let isOpened = false;

let cookieIndex = 0;

/* LOGIN */

enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", e => {
  if(e.key === "Enter"){
    checkPassword();
  }
});

function checkPassword(){

  if(passwordInput.value.trim().toUpperCase() === "BTSXSIEMPRE"){

    loginScreen.classList.add("hide-login");

    setTimeout(()=>{

      loginScreen.style.display = "none";

      mainScene.classList.remove("hidden");

    },800);

  }else{

    errorText.innerText = "WRONG PASSWORD";

  }

}

/* DRAG */

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag, {passive:true});
window.addEventListener("touchmove", drag, {passive:false});
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
  if(move > 60) move = 60;

  updatePack(move);

  e.preventDefault();
}

/* END */

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  if(move > 28){

    isOpened = true;

    rightPack.style.transition =
      "transform 0.18s ease-out";

    updatePack(60);

    setTimeout(()=>{

      rightPack.style.transform = `
        rotateZ(10deg)
        translateX(10px)
        translateY(6px)
      `;

    },120);

    setTimeout(()=>{

      rightPack.style.transition =
        "transform 2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.5s";

      rightPack.style.transform = `
        rotateZ(25deg)
        translateX(30px)
        translateY(900px)
      `;

      setTimeout(()=>{

        rightPack.style.opacity = "0";
        rightPack.style.display = "none";

      },1500);

    },260);

  }else{

    rightPack.style.transition =
      "transform .35s ease";

    updatePack(0);

  }

}

/* UPDATE */

function updatePack(m){

  const rotate = m * -0.15;

  rightPack.style.transform = `
    rotateZ(${rotate}deg)
    translateX(${m * 0.08}px)
  `;

  inside.style.width = `${m * 1.1}px`;

  inside.style.opacity = 0.2 + (m / 120);
}

/* GET X */

function getX(e){

  return e.touches
    ? e.touches[0].clientX
    : e.clientX;
}

/* SPAWN COOKIES */

leftPack.addEventListener("click", spawnCookie);

function spawnCookie(){

  if(!isOpened) return;

  if(cookieIndex >= cookieElements.length) return;

  const cookie = cookieElements[cookieIndex];

  cookie.classList.add("show");

  cookie.classList.add(`pos${cookieIndex + 1}`);

  cookieIndex++;
}

/* GIRAR GALLETAS */

cookieElements.forEach((cookie,index)=>{

  let isPressing = false;
  let lastAngle = 0;
  let progress = 0;

  cookie.addEventListener("mousedown", startCircle);
  cookie.addEventListener("touchstart", startCircle, {passive:true});

  window.addEventListener("mousemove", moveCircle);
  window.addEventListener("touchmove", moveCircle, {passive:false});

  window.addEventListener("mouseup", endCircle);
  window.addEventListener("touchend", endCircle);

  function startCircle(e){

    if(!cookie.classList.contains("show")) return;

    if(cookie.classList.contains("open")) return;

    isPressing = true;

    progress = 0;

    const pos = getCookiePos(e,cookie);

    lastAngle = Math.atan2(pos.y,pos.x);
  }

  function moveCircle(e){

    if(!isPressing) return;

    const pos = getCookiePos(e,cookie);

    const angle = Math.atan2(pos.y,pos.x);

    let delta = angle - lastAngle;

    if(delta > Math.PI){
      delta -= Math.PI * 2;
    }

    if(delta < -Math.PI){
      delta += Math.PI * 2;
    }

    progress += Math.abs(delta);

    lastAngle = angle;

    const scale =
      1 + Math.min(progress * 0.03,0.12);

    cookie.style.filter = `
      brightness(${1 + progress * 0.03})
      drop-shadow(0 0 25px rgba(255,255,255,0.35))
    `;

    if(progress > 6){

      activateCookie(cookie,index);

      isPressing = false;
    }

    e.preventDefault();
  }

  function endCircle(){

    isPressing = false;

    if(!cookie.classList.contains("open")){
      cookie.style.filter = "";
    }
  }

});

/* POS COOKIE */

function getCookiePos(e,el){

  const rect = el.getBoundingClientRect();

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

  return {x,y};
}

/* ACTIVAR */

function activateCookie(cookie,index){

  if(cookie.classList.contains("open")) return;

  cookie.classList.add("open");

  const phrases = [
    "Dulce energía",
    "Golden hour",
    "Stay soft",
    "Purple soul",
    "Shine more",
    "Sweet vibes",
    "BTS forever",
    "Enjoy moment"
  ];

  const text = document.createElement("div");

  text.className = "cookie-text";

  text.innerText = phrases[index];

  cookie.appendChild(text);

  cookie.animate([
    {
      transform:"translateY(-50%) scale(1)"
    },
    {
      transform:"translateY(-50%) scale(1.08)"
    },
    {
      transform:"translateY(-50%) scale(1)"
    }
  ],{
    duration:500
  });

}
