const tearStrip = document.getElementById("tearStrip");
const inside = document.querySelector(".inside");

let isDragging = false;

let startY = 0;
let currentMove = 0;

let isOpen = false;

tearStrip.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

tearStrip.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e){

  if(isOpen) return;

  isDragging = true;

  startY = getY(e);

  tearStrip.style.transition = "none";
}

function drag(e){

  if(!isDragging) return;

  let currentY = getY(e);

  currentMove = currentY - startY;

  if(currentMove < 0) currentMove = 0;
  if(currentMove > 220) currentMove = 220;

  updatePack(currentMove);
}

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  tearStrip.style.transition = "0.4s ease";

  if(currentMove > 120){

    currentMove = 220;
    isOpen = true;

  }else{

    currentMove = 0;
  }

  updatePack(currentMove);
}

function updatePack(move){

  tearStrip.style.transform =
    `translateY(${move}px)`;

  inside.style.height = `${move}px`;
}

function getY(e){

  if(e.touches){
    return e.touches[0].clientY;
  }

  return e.clientY;
}
