const rightPack = document.getElementById("rightPack");
const inside = document.querySelector(".inside");

let isDragging = false;

let startX = 0;
let currentX = 0;

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

  currentX = getX(e);

  let move = currentX - startX;

  if(move < 0) move = 0;
  if(move > 180) move = 180;

  rightPack.style.transform =
    `translateX(${move}px) rotate(${move * 0.05}deg)`;

  inside.style.opacity = move / 100;
}

function stopDrag(){

  isDragging = false;

  rightPack.style.transition = "0.4s ease";

  rightPack.style.transform = `translateX(0px)`;

  inside.style.opacity = 0;
}

function getX(e){

  if(e.touches){
    return e.touches[0].clientX;
  }

  return e.clientX;
}
