const rightPack = document.getElementById("rightPack");
const inside = document.querySelector(".inside");

let isDragging = false;

let startX = 0;
let currentMove = 0;

let isOpen = false;

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e){

  if(isOpen) return;

  isDragging = true;

  startX = getX(e);

  rightPack.style.transition = "none";
}

function drag(e){

  if(!isDragging) return;

  let currentX = getX(e);

  currentMove = currentX - startX;

  if(currentMove < 0) currentMove = 0;
  if(currentMove > 180) currentMove = 180;

  updatePack(currentMove);
}

function stopDrag(){

  if(!isDragging) return;

  isDragging = false;

  rightPack.style.transition = "0.4s ease";

  // SI abrió suficiente
  if(currentMove > 90){

    currentMove = 180;
    isOpen = true;

  }else{

    currentMove = 0;
  }

  updatePack(currentMove);
}

function updatePack(move){

  rightPack.style.transform =
    `translateX(${move}px) rotate(${move * 0.05}deg)`;

  inside.style.opacity = move / 100;
}

function getX(e){

  if(e.touches){
    return e.touches[0].clientX;
  }

  return e.clientX;
}
