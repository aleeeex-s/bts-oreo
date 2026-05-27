const rightPack = document.getElementById("rightPack");
const inside = document.querySelector(".inside");

let isDragging = false;

let startX = 0;

let currentRotation = 0;

rightPack.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDrag);

rightPack.addEventListener("touchstart", startDrag);
window.addEventListener("touchmove", drag);
window.addEventListener("touchend", stopDrag);

function startDrag(e){

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

  isDragging = false;

  rightPack.style.transition = "0.4s ease";

  // SI abrió suficiente
  if(currentRotation > 70){

    updatePack(140);

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
