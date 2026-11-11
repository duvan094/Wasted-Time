const incBtn = document.getElementById("incButton");
const decBtn = document.getElementById("decButton");

const btnContainer = document.getElementById("btnContainer");

const opacityIncValue = 0.00001;

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
const heading = document.querySelector("h1");

const STORAGE_KEY = "wastedTime.seconds";
const RAGE_AFTER_SECONDS = 10 * 60;

const headlines = [
  "Procrastination has gone too far! This is not a joke, this is a call for help!",
  "Your thesis is waiting. It has been waiting for a very long time.",
  "Congratulations, you opened this instead of writing. Again.",
  "Just one more minute. Said the last 47 minutes.",
  "Your supervisor would like a word. Several, actually.",
  "This is fine. Everything is fine. Close the tab. (Don't.)"
];

const hiddenTitles = [
  "Come back!",
  "Get back to your thesis!",
  "Still wasting time...",
  "We see you in the other tab",
  "Psst. Over here."
];

heading.textContent = headlines[Math.floor(Math.random() * headlines.length)];

function loadTime() {
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return saved > 0 ? saved : 0;
  } catch (e) {
    return 0; // storage blocked, e.g. private mode
  }
}

function saveTime() {
  try {
    localStorage.setItem(STORAGE_KEY, time);
  } catch (e) {}
}

let time = loadTime(); //seconds
let timeString = "0:00";
let hiddenTitle = hiddenTitles[0];

function incSeconds() {
  time += 1;
  updateTimeString();
}

function decSeconds() {
  time = time - 1 <= 0 ? 0 : time - 1;
  updateTimeString();
}

function renderTitle() {
  title.textContent = document.hidden ? hiddenTitle + " " + timeString : timeString;
}

function updateTimeString(){
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;

  timeString = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

  nbr.textContent = timeString;
  renderTitle();
  saveTime();
}

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    hiddenTitle = hiddenTitles[Math.floor(Math.random() * hiddenTitles.length)];
  }
  renderTitle();
});

updateTimeString();

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

/*Gifs shown once you have wasted RAGE_AFTER_SECONDS*/
const rageGifArr = [
  "fLDsHzBdhe3BAj8Os8",
  "37dKDRDAnPJny",
  "yrJjsr6c22NyXPPhmL",
  "GICASZKnHUo1gAF36U",
  "RkMQkHC43tqwSdJeS4",
  "DYhWQulNh8cHJ5lJNq",
  "8MROOKOiQKyPe"
];

/*Pre loads in the gifs*/
function preload(ids) {
  return ids.map(function(id) {
    let newImg = new Image();
    newImg.src = "https://i.giphy.com/media/" + id + "/giphy.webp";
    return newImg;
  });
}

const gifLoadedArr = preload(gifArr);
const rageLoadedArr = preload(rageGifArr);

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
  const clientX = event.touches[0].clientX;
  const clientY = event.touches[0].clientY;

  moveInit(clientX, clientY);
}, false);

gif.addEventListener("mousedown", function(event) {
  moveInit(event.clientX, event.clientY);
});

let lastTouchX, lastTouchY;

gif.addEventListener("touchmove", function(event){
  const clientX = event.touches[0].clientX;
  const clientY = event.touches[0].clientY;

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
  let width, height;
  if(gif.xPos <= 0){
    let procent = Math.floor((clientX/(mousePosX))*100)/100;
    width = procent > 0.5 && procent <= 1 ? procent : 0.5;
    height = 2 - width;
    gif.xPos = 0;

    if(gif.yPos <= 0){
      gif.yPos = 0;
      gif.style.top = 0 + "px";
    }

    if(gif.yPos + gif.offsetHeight * height >= window.innerHeight){
      gif.yPos = window.innerHeight - gif.offsetHeight * height;
      gif.style.top = gif.yPos + "px";
    }

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

    if(gif.yPos <= 0){
      gif.yPos = 0;
      gif.style.top = 0 + "px";
    }

    if(gif.yPos + gif.offsetHeight * height >= window.innerHeight){
      gif.yPos = window.innerHeight - gif.offsetHeight * height;
      gif.style.top = gif.yPos + "px";
    }

    gif.style.left = gif.xPos + "px";

    gif.style.transition = "";

  }else if(gif.yPos <= 0){
    let procent = Math.floor((clientY/mousePosY)*100)/100;
    height = procent > 0.5 && procent <= 1 ? procent : 0.5;
    width = 2 - height;

    if(gif.xPos <= 0){
      gif.xPos = 0;
      gif.style.left = 0 + "px";
    }

    if(gif.xPos + gif.offsetWidth * width >= window.innerWidth){
      gif.xPos = window.innerWidth - gif.offsetWidth * width;
      gif.style.left = gif.xPos + "px";
    }



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

    if(gif.xPos <= 0){
      gif.xPos = 0;
      gif.style.left = 0 + "px";
    }

    if(gif.xPos + gif.offsetWidth * width >= window.innerWidth){
      gif.xPos = window.innerWidth - gif.offsetWidth * width;
      gif.style.left = gif.xPos + "px";
    }


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
  const pool = time >= RAGE_AFTER_SECONDS ? rageLoadedArr : gifLoadedArr;

  /*Skip gifs that failed to load (e.g. removed from giphy) and the current one*/
  const candidates = pool.filter(function(img) {
    return img.naturalWidth > 0 && img.src !== gif.src;
  });

  if (candidates.length === 0) return;

  gif.src = candidates[Math.floor(Math.random() * candidates.length)].src;
}

/*If the current gif dies, swap to a working one*/
gif.addEventListener("error", changeGif);
