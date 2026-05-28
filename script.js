const passwordInput = document.getElementById("passwordInput");
const enterBtn = document.getElementById("enterBtn");
const errorText = document.getElementById("errorText");

const loginScreen = document.getElementById("loginScreen");
const mainScene = document.getElementById("mainScene");

/* PASSWORD */

enterBtn.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){
    checkPassword();
  }

});

function checkPassword(){

  const password = passwordInput.value;

  if(password === "BTSXSIEMPRE"){

    loginScreen.style.opacity = "0";

    setTimeout(() => {

      loginScreen.style.display = "none";

      mainScene.classList.remove("hidden");

    }, 800);

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
  if(move > 140) move = 140;

  currentRotation = move;

  updatePack(move);
}

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  rightPack.style.transition = "0.4s ease";

  if(currentRotation > 70){

    updatePack(140);

    isOpened = true;

    rightPack.style.cursor = "default";

  }else{

    updatePack(0);

  }

}

function updatePack(move){

  let rotate = move * -0.6;

  rightPack.style.transform =
    `perspective(1200px)
     rotateY(${rotate}deg)
     translateX(${move * 0.35}px)`;

  inside.style.width = `${move * 0.9}px`;
}

function getX(e){

  if(e.touches){
    return e.touches[0].clientX;
  }

  return e.clientX;
}
