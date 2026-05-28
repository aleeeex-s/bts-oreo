const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");

const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

/* PASSWORD */

enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", (e)=>{

  if(e.key === "Enter"){
    checkPassword();
  }
});

function checkPassword(){

  const password = passwordInput.value;

  if(password === "BTSXSIEMPRE"){

    loginScreen.style.opacity = "0";

    setTimeout(()=>{

      loginScreen.style.display = "none";

      mainScene.classList.remove("hidden");

    },800);

  }else{

    errorText.innerText = "WRONG PASSWORD";

    loginScreen.animate(
      [
        { transform:"translateX(-8px)" },
        { transform:"translateX(8px)" },
        { transform:"translateX(-5px)" },
        { transform:"translateX(5px)" },
        { transform:"translateX(0px)" }
      ],
      {
        duration:400
      }
    );
  }
}

/* PAQUETE */

const rightPack = document.getElementById("rightPack");
const inside = document.querySelector(".inside");

let isDragging = false;

let startX = 0;

let currentRotation = 0;

let isOpened = false;

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e){

  if(isOpened) return;

  isDragging = true;

  startX = getX(e);

  rightPack.style.transition = "none";
}

function drag(e){

  if(!isDragging) return;

  let currentX = getX(e);

  let move = currentX - startX;

  if(move < 0) move = 0;
  if(move > 60) move = 60;

  currentRotation = move;

  updatePack(move);
}

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  if(currentRotation > 28){

    isOpened = true;

    rightPack.style.cursor = "default";

    /* APERTURA PEQUEÑA */

    rightPack.style.transition =
    "transform 0.16s ease-out";

    updatePack(60);

    /* DESPEGUE */

    setTimeout(()=>{

      rightPack.style.transition =
      "transform 0.14s ease-out";

      rightPack.style.transform =
      `
        rotateZ(8deg)
        translateX(8px)
        translateY(6px)
      `;

    },100);

    /* CAÍDA */

    setTimeout(()=>{

      rightPack.classList.add("falling");

      rightPack.style.transition =
      "transform 2.2s cubic-bezier(.16,.72,.2,1), opacity 0.4s linear 1.8s";

      rightPack.style.transform =
      `
        rotateZ(22deg)
        translateX(18px)
        translateY(850px)
      `;

      setTimeout(()=>{

        rightPack.style.opacity = "0";

      },1800);

    },260);

  }else{

    rightPack.style.transition =
    "transform 0.35s ease";

    updatePack(0);
  }
}

function updatePack(move){

  let rotate = move * -0.15;

  rightPack.style.transform =
  `
    rotateZ(${rotate}deg)
    translateX(${move * 0.08}px)
  `;

  inside.style.width =
  `${move * 1.1}px`;

  inside.style.opacity =
  0.2 + (move / 120);
}

function getX(e){

  if(e.touches){
    return e.touches[0].clientX;
  }

  return e.clientX;
}
