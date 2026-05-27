const rightPack = document.getElementById("rightPack");
const inside = document.querySelector(".inside");

let isDragging = false;

let startX = 0;

let currentRotation = 0;

let isOpened = false;

/* EVENTOS */

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

/* START */

function startDrag(e){

  // SI YA ESTÁ ABIERTO → NO HACER NADA
  if(isOpened) return;

  isDragging = true;

  startX = getX(e);

  rightPack.style.transition = "none";
}

/* DRAG */

function drag(e){

  if(!isDragging) return;

  let currentX = getX(e);

  let move = currentX - startX;

  if(move < 0) move = 0;
  if(move > 140) move = 140;

  currentRotation = move;

  updatePack(move);
}

/* STOP */

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  rightPack.style.transition = "0.4s ease";

  // SI ABRIÓ SUFICIENTE
  if(currentRotation > 70){

    updatePack(140);

    // QUEDA ABIERTO PARA SIEMPRE
    isOpened = true;

    // cambia cursor
    rightPack.style.cursor = "default";

  }else{

    updatePack(0);
  }
}

/* ACTUALIZAR */

function updatePack(move){

  let rotate = move * -0.6;

  rightPack.style.transform =
    `perspective(1200px)
     rotateY(${rotate}deg)
     translateX(${move * 0.35}px)`;

  inside.style.width = `${move * 0.9}px`;
}

/* UTILIDAD */

function getX(e){

  if(e.touches){
    return e.touches[0].clientX;
  }

  return e.clientX;
}
