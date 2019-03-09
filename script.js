const incBtn = document.getElementById("incButton");
const decBtn = document.getElementById("decButton");

const btnContainer = document.getElementById("btnContainer");

const opacityIncValue = 0.0001;

const text = document.querySelectorAll("H1, H2,p");
const background = document.querySelector("body");

function changeTitleColor() {
  let hue = 250 * Math.random();
  let color = "hsl(" + hue + ",100%,50%)";

  for (let i = 0; i < text.length; i++) {
    text[i].style.color = color;
  }

  background.style.background = "hsl(" + (250 - hue) + ",90%,40%)";
}

setInterval(changeTitleColor, 2000);

btnContainer.addEventListener("mouseover", function(event) {
  let topPos = Math.floor(
    Math.random() * (window.innerHeight - btnContainer.offsetHeight)
  );
  let leftPos = Math.floor(
    Math.random() * (window.innerWidth - btnContainer.offsetWidth)
  );

  btnContainer.style.transform = "translateX(0)";

  btnContainer.style.transition = "";
  btnContainer.style.transform = "scale(0,0)";
  void btnContainer.offsetWidth;
  btnContainer.style.transition = "transform 0.5s ease-out";
  btnContainer.style.transform = "scale(1,1)";

  btnContainer.style.top = topPos + "px";
  btnContainer.style.left = leftPos + "px";
});

const nbr = document.getElementById("number");
const title = document.querySelector("title");
let time = 0;//seconds

function incSeconds() {
  time += 1;

  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;

  nbr.innerHTML = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  title.innerHTML = time < 2 ? time + " second wasted" : time + " seconds wasted";
}

function decSeconds() {
  time -= 1;
  nbr.innerHTML = time;
  title.innerHTML = time < 2 ? time + " second wasted" : time + " seconds wasted";
}

incBtn.addEventListener("click", incSeconds);
decBtn.addEventListener("click", decSeconds);

/*Increase time every second*/
setInterval(function() {
  incSeconds();
}, 1000);

const gifArr = [
  "3oFyDpRagf96Uz9rzO",
  "M5myuxwZaK2J2",
  "t6lGyl8QLylqFQJkiA",
  "JIX9t2j0ZTN9S",
  "1d7F9xyq6j7C1ojbC5",
  "VOq7iem25Z94Y",
  "k6Wm3KbGfY7rk6PK4L",
  "nEXmNl3uha5YA"
];

const gifLoadedArr = [];

/*Pre loads in the gifs*/
for (let i = 0; i < gifArr.length; i++) {
  let newImg = new Image();
  newImg.src = "https://i.giphy.com/media/" + gifArr[i] + "/giphy.webp";
  gifLoadedArr.push(newImg);
}

const gif = document.getElementById("gif");

gif.speed = 2;
gif.xPos = gif.getBoundingClientRect().left;
gif.yPos = gif.getBoundingClientRect().top;
gif.xDir = 1 * gif.speed;
gif.yDir = 1 * gif.speed;
gif.moving = false;

const overlay = document.getElementById("red-overlay");
let opacity = 0;

function gifMove() {
  if (!gif.moving) {
    gif.xPos += gif.xDir;
    gif.yPos += gif.yDir;

    if (
      gif.xPos + gif.offsetWidth > window.innerWidth ||
      gif.xPos < 0 ||
      (gif.yPos > window.innerHeight - gif.offsetHeight || gif.yPos < 0)
    ) {
      changeGif();
      if (gif.xPos + gif.offsetWidth > window.innerWidth || gif.xPos < 0) {
        if (gif.xPos + gif.offsetWidth > window.innerWidth) {
          gif.xPos = window.innerWidth - gif.offsetWidth;
        } else if (gif.xPos < 0) {
          gif.xPos = 0;
        }

        gif.xDir = -1 * gif.xDir;
        bumbAnimation("horizontal");
      } else {
        if (gif.yPos + gif.offsetHeight > window.innerHeight) {
          gif.yPos = window.innerHeight - gif.offsetHeight;
        } else if (gif.yPos < 0) {
          gif.yPos = 0;
        }

        gif.yDir = -1 * gif.yDir;
        bumbAnimation("vertical");
      }
    }

    gif.style.left = gif.xPos + "px";
    gif.style.top = gif.yPos + "px";


    if (opacity < 0.8) {
      opacity += opacityIncValue;
      overlay.style.opacity = opacity;
      if (opacity >= 0.8) {
        document.getElementById("skew-wrapper").classList.add("skew");
      }
    }
  }

  requestAnimationFrame(gifMove);
}

requestAnimationFrame(gifMove);

window.addEventListener("load", function() {
  document.body.classList.remove("fade");
});

function bumbAnimation(direction) {
  if (direction == "horizontal") {
    gif.classList.remove("bumpVertical");
    gif.classList.remove("bumpHorizontal");
    void gif.offsetWidth;
    gif.classList.add("bumpHorizontal");
  } else if (direction == "vertical") {
    gif.classList.remove("bumpHorizontal");
    gif.classList.remove("bumpVertical");
    void gif.offsetWidth;
    gif.classList.add("bumpVertical");
  }
}

let oldX, oldY;
let initialX, initialY;
let mousePosX, mousePosY;

gif.addEventListener("touchstart", function(event){
  clientX = event.touches[0].clientX;
  clientY = event.touches[0].clientY;

  moveInit(clientX, clientY);
}, false);

gif.addEventListener("mousedown", function(event) {
  moveInit(event.clientX, event.clientY);
});

let lastTouchX, lastTouchY;

gif.addEventListener("touchmove", function(event){
  clientX = event.touches[0].clientX;
  clientY = event.touches[0].clientY;

  lastTouchX = clientX;
  lastTouchY = clientY;

  moving(clientX, clientY);
}, false);

window.addEventListener("mousemove", function(event) {
  moving(event.clientX, event.clientY);
});

gif.addEventListener("touchcancel", function(event){

}, false);

gif.addEventListener("touchend", function(event){
  moveEnd(lastTouchX, lastTouchY);
}, false);

window.addEventListener("mouseup", function(event) {
  moveEnd(event.clientX, event.clientY);
});


function moveInit(clientX, clientY){
  gif.moving = true;
  gif.className = "dragging";
  oldX = initialX = clientX;
  oldY = initialY = clientY;

  mousePosX = oldX - gif.getBoundingClientRect().left; //x position within the element.
  mousePosY = oldY - gif.getBoundingClientRect().top; //y position within the element.
}

function moving(clientX, clientY){
  if (gif.moving) {
    let x;
    let y;
    let newX = clientX;
    let newY = clientY;

    gif.xPos = newX - mousePosX;
    gif.yPos = newY - mousePosY;

    gif.style.top = gif.yPos + "px";
    gif.style.left = gif.xPos + "px";

    oldX = newX;
    oldY = newY;

    squeeze(clientX, clientY);

  }
}


function squeeze(clientX, clientY){
  if(gif.xPos <= 0){
    let procent = Math.floor((clientX/(mousePosX))*100)/100;
    width = procent > 0.5 && procent <= 1 ? procent : 0.5;
    height = 2 - width;
    gif.xPos = 0;
    gif.style.left = gif.xPos;
    gif.style.transform = "scale(" + width + "," + height + ")";
    gif.style.transformOrigin = "0 0";
    gif.style.transition = "";
  }else if(gif.xPos + gif.offsetWidth >= window.innerWidth){
    let procent = Math.floor((Math.abs(clientX-window.innerWidth)/(gif.offsetWidth-mousePosX))*100)/100;
    width = procent > 0.5 && procent <= 1 ? procent : 0.5;
    height = 2 - width;
    gif.style.transform = "scale(" + width + "," + height + ")";
    gif.style.transformOrigin = "100% 0";
    gif.xPos = window.innerWidth - gif.offsetWidth;

    gif.style.left = gif.xPos + "px";
    gif.style.transition = "";

  }else if(gif.yPos <= 0){
    let procent = Math.floor((clientY/mousePosY)*100)/100;
    height = procent > 0.5 && procent <= 1 ? procent : 0.5;
    width = 2 - height;
    gif.yPos = 0;
    gif.style.top = gif.yPos;
    gif.style.transform = "scale(" + width + "," + height + ")";
    gif.style.transformOrigin = "0 0";
    gif.style.transition = "";
  }else if(gif.yPos + gif.offsetHeight >= window.innerHeight){
    let procent = Math.floor((Math.abs(clientY-window.innerHeight)/(gif.offsetHeight-mousePosY))*100)/100;
    height = procent > 0.5 && procent <= 1 ? procent : 0.5;
    width = 2 - height;
    gif.style.transform = "scale(" + width + "," + height + ")";
    gif.style.transformOrigin = "0 100%";
    gif.yPos = window.innerHeight - gif.offsetHeight;

    gif.style.top = gif.yPos + "px";
    gif.style.transition = "";

  }else{
    gif.style.transform = "scale(1,1)";
     gif.style.transformOrigin = "50% 50%";
  }

}

function moveEnd(clientX, clientY){
    squeeze(clientX, clientY);

    if (gif.moving) {
      gif.moving = false;
      gif.classList.remove("dragging");
      gif.xPos = oldX - mousePosX;
      gif.yPos = oldY - mousePosY;

      let xDiff = clientX - initialX;
      let yDiff = clientY - initialY;

      let directionX, directionY;

      /*See if which direction the gif is going*/
      if (xDiff < 0) {
        directionX = -1;
      } else {
        directionX = 1;
      }

      if (yDiff < 0) {
        directionY = -1;
      } else {
        directionY = 1;
      }

      /*Calculate the speed each direction should go*/
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        let procent = Math.abs(xDiff) / Math.abs(yDiff);

        gif.xDir = directionX * (2 * gif.speed * procent);
        gif.yDir = directionY * (2 * gif.speed * (1 - procent));
      } else {
        let procent = Math.abs(yDiff) / Math.abs(xDiff);
        gif.xDir = directionX * (2 * gif.speed * (1 - procent));
        gif.yDir = directionY * (2 * gif.speed * procent);
      }

      /*Check if the gif is outside the bounds of the window*/
      if (gif.xPos + gif.offsetWidth > window.innerWidth) {
        gif.xPos = window.innerWidth - gif.offsetWidth;
        gif.style.left = gif.xPos + "px";
      } else if (gif.xPos < 0) {
        gif.xPos = 0;
        gif.style.left = gif.xPos + "px";
      }

      if (gif.yPos > window.innerHeight - gif.offsetHeight) {
        gif.yPos = window.innerHeight - gif.offsetHeight;
        gif.style.top = gif.yPos + "px";
      } else if (gif.yPos < 0) {
        gif.yPos = 0;
        gif.style.top = gif.yPos + "px";
      }
    }

}

function changeGif() {
  let newGif = gifLoadedArr[Math.floor(Math.random() * gifLoadedArr.length)];

  while (newGif.src == gif.src) {
    newGif = gifLoadedArr[Math.floor(Math.random() * gifLoadedArr.length)];
  }

  gif.src = newGif.src;
}
