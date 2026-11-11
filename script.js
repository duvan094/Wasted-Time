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

function dodgeButtons() {
  let topPos = Math.floor(
    Math.random() * Math.max(0, window.innerHeight - btnContainer.offsetHeight)
  );
  let leftPos = Math.floor(
    Math.random() * Math.max(0, window.innerWidth - btnContainer.offsetWidth)
  );

  btnContainer.style.transform = "translateX(0)";

  btnContainer.style.transition = "";
  btnContainer.style.transform = "scale(0,0)";
  void btnContainer.offsetWidth;
  btnContainer.style.transition = "transform 0.5s ease-out";
  btnContainer.style.transform = "scale(1,1)";

  btnContainer.style.top = topPos + "px";
  btnContainer.style.left = leftPos + "px";
}

btnContainer.addEventListener("mouseover", dodgeButtons);

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

function decSeconds(amount) {
  time = Math.max(0, time - (amount || 1));
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
decBtn.addEventListener("click", askToWork);

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

const CRUISE_SPEED = 3; //normal px per frame
const FRICTION = 0.985; //how fast a thrown gif slows back to cruise speed

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
    /*A thrown gif slows down until it is back to cruise speed*/
    if (gravityOn) {
      applyGravity();
    } else {
      let speed = Math.hypot(gif.xDir, gif.yDir);
      if (speed > CRUISE_SPEED) {
        let factor = Math.max(CRUISE_SPEED / speed, FRICTION);
        gif.xDir *= factor;
        gif.yDir *= factor;
      }
    }

    gif.xPos += gif.xDir;
    gif.yPos += gif.yDir;

    if (
      gif.xPos + gif.offsetWidth > window.innerWidth ||
      gif.xPos < 0 ||
      (gif.yPos > window.innerHeight - gif.offsetHeight || gif.yPos < 0)
    ) {
      /*Small gravity hops shouldn't swap the gif every time*/
      if (!gravityOn || Math.abs(gif.xDir) > 4 || Math.abs(gif.yDir) > 4) {
        changeGif();
      }
      if (gif.xPos + gif.offsetWidth > window.innerWidth || gif.xPos < 0) {
        if (gif.xPos + gif.offsetWidth > window.innerWidth) {
          gif.xPos = window.innerWidth - gif.offsetWidth;
        } else if (gif.xPos < 0) {
          gif.xPos = 0;
        }

        gif.xDir = -1 * gif.xDir * (gravityOn ? WALL_BOUNCE : 1);
        bumbAnimation("horizontal");
      } else {
        if (gif.yPos + gif.offsetHeight > window.innerHeight) {
          gif.yPos = window.innerHeight - gif.offsetHeight;
        } else if (gif.yPos < 0) {
          gif.yPos = 0;
        }

        gif.yDir = -1 * gif.yDir * (gravityOn ? FLOOR_BOUNCE : 1);
        if (
          gravityOn &&
          Math.abs(gif.yDir) < 1.2 &&
          gif.yPos >= window.innerHeight - gif.offsetHeight - 0.5
        ) {
          gif.yDir = 0; //come to rest on the floor
        }
        bumbAnimation("vertical");
      }
    }

    gif.style.left = gif.xPos + "px";
    gif.style.top = gif.yPos + "px";


    checkGifInteractions();

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
  blip();
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

/*Pointer Events cover mouse, touch and pen. Capturing the pointer keeps
  the drag alive even when it leaves the gif or the window.*/
gif.addEventListener("pointerdown", function(event) {
  if (event.button !== undefined && event.button !== 0) return;
  gif.setPointerCapture(event.pointerId);
  moveInit(event.clientX, event.clientY);
});

gif.addEventListener("pointermove", function(event) {
  moving(event.clientX, event.clientY);
});

gif.addEventListener("pointerup", function(event) {
  moveEnd(event.clientX, event.clientY);
});

gif.addEventListener("pointercancel", function(event) {
  moveEnd(event.clientX, event.clientY);
});

/*Keep the gif inside the window when it is resized*/
window.addEventListener("resize", function() {
  gif.xPos = Math.max(0, Math.min(gif.xPos, window.innerWidth - gif.offsetWidth));
  gif.yPos = Math.max(0, Math.min(gif.yPos, window.innerHeight - gif.offsetHeight));
  gif.style.left = gif.xPos + "px";
  gif.style.top = gif.yPos + "px";
});

/*Throw physics: speed comes from how fast the pointer moved just before release*/
const THROW_WINDOW_MS = 100;
const MAX_THROW_SPEED = 30; //px per frame
const FRAME_MS = 1000 / 60;
let samples = [];

function recordSample(x, y) {
  const now = performance.now();
  samples.push({ x: x, y: y, t: now });
  while (samples.length > 1 && now - samples[0].t > THROW_WINDOW_MS) {
    samples.shift();
  }
}

/*Pointer velocity in px per frame, zero if it stopped before release*/
function throwVelocity() {
  if (samples.length < 2) return { x: 0, y: 0 };
  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = last.t - first.t;
  if (dt < 8 || performance.now() - last.t > THROW_WINDOW_MS) {
    return { x: 0, y: 0 };
  }
  return {
    x: (last.x - first.x) / dt * FRAME_MS,
    y: (last.y - first.y) / dt * FRAME_MS
  };
}

function moveInit(clientX, clientY){
  gif.moving = true;
  gif.className = "dragging";
  oldX = initialX = clientX;
  oldY = initialY = clientY;
  samples = [];
  recordSample(clientX, clientY);

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
    recordSample(clientX, clientY);

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

      let v = throwVelocity();
      let speed = Math.hypot(v.x, v.y);

      if (speed > MAX_THROW_SPEED) {
        v.x = v.x / speed * MAX_THROW_SPEED;
        v.y = v.y / speed * MAX_THROW_SPEED;
      } else if (speed < CRUISE_SPEED) {
        /*Barely moved: cruise at normal speed, keeping the old heading if the pointer was still*/
        let dx = speed < 0.01 ? gif.xDir : v.x;
        let dy = speed < 0.01 ? gif.yDir : v.y;
        let len = Math.hypot(dx, dy) || 1;
        v.x = dx / len * CRUISE_SPEED;
        v.y = dy / len * CRUISE_SPEED;
      }

      gif.xDir = v.x;
      gif.yDir = v.y;

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


/* ---------- Toast ---------- */

const toast = document.createElement("div");
toast.id = "toast";
document.body.appendChild(toast);
let toastTimer;

function announce(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove("show");
  }, 3500);
}

const reducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- "Are you sure you want to work?" ---------- */

const WORK_REWARD_SECONDS = 30;
const WORK_PENALTY_SECONDS = 30;
const MAX_POPUP_ROUNDS = 3;

const popupQuestions = [
  "Are you sure you want to work?",
  "Work? Voluntarily? Now?",
  "This will reduce your wasted time. Think of the consequences.",
  "Your sofa will miss you. Continue?",
  "Really, really sure?"
];

let popupOpen = false;

function askToWork() {
  if (popupOpen) return;
  popupOpen = true;
  showWorkPopup(1);
}

function showWorkPopup(round) {
  const backdrop = document.createElement("div");
  backdrop.className = "popup-backdrop";

  const box = document.createElement("div");
  box.className = "popup";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");

  const question = document.createElement("div");
  question.className = "popup-text";
  question.textContent = popupQuestions[Math.floor(Math.random() * popupQuestions.length)];

  const yes = document.createElement("button");
  yes.textContent = "Yes, I want to work";
  const no = document.createElement("button");
  no.textContent = "No, keep procrastinating";
  no.className = "red";

  function close() {
    document.removeEventListener("keydown", onKey);
    backdrop.remove();
  }

  function onYes() {
    close();
    if (round < MAX_POPUP_ROUNDS && Math.random() < 0.5) {
      showWorkPopup(round + 1); //are you REALLY sure?
    } else {
      popupOpen = false;
      confirmWork();
    }
  }

  function onNo() {
    close();
    popupOpen = false;
    time += WORK_PENALTY_SECONDS;
    updateTimeString();
    announce("Wise choice. +" + WORK_PENALTY_SECONDS + "s of procrastination.");
  }

  function onKey(event) {
    if (event.key === "Escape") onNo();
  }

  yes.addEventListener("click", onYes);
  no.addEventListener("click", onNo);
  document.addEventListener("keydown", onKey);

  box.appendChild(question);
  /*Randomise the button order so you can't click on autopilot*/
  if (Math.random() < 0.5) {
    box.appendChild(yes);
    box.appendChild(no);
  } else {
    box.appendChild(no);
    box.appendChild(yes);
  }
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
  (Math.random() < 0.5 ? no : yes).focus({ preventScroll: true });
}

function confirmWork() {
  decSeconds(WORK_REWARD_SECONDS);
  announce("You worked. -" + WORK_REWARD_SECONDS + "s. Who are you?");
}

/* ---------- Escalating chaos ---------- */

let ghost = null; //second, undraggable gif

function addDecoys() {
  const labels = ["Decrease your wasted time", "Stop procrastinating", "Work now (really)"];
  labels.forEach(function(label) {
    const decoy = document.createElement("button");
    decoy.textContent = label;
    decoy.className = "red";
    decoy.tabIndex = -1;
    decoy.addEventListener("click", function() {
      time += 10;
      updateTimeString();
      announce("Decoy! +10s");
    });
    /*Shuffle in among the real buttons*/
    btnContainer.insertBefore(
      decoy,
      btnContainer.children[Math.floor(Math.random() * btnContainer.children.length)]
    );
  });
}

function startSpin() {
  if (reducedMotion) return;
  heading.classList.add("spin");
  nbr.classList.add("spin");
}

function spawnGhost() {
  const img = document.createElement("img");
  img.className = "ghost";
  img.src = gif.src;
  document.getElementById("skew-wrapper").appendChild(img);

  ghost = {
    el: img,
    xPos: Math.random() * Math.max(0, window.innerWidth - 150),
    yPos: Math.random() * Math.max(0, window.innerHeight - 150),
    xDir: -CRUISE_SPEED * 0.8,
    yDir: CRUISE_SPEED * 0.6
  };

  function ghostMove() {
    const ghostSpeed = Math.hypot(ghost.xDir, ghost.yDir);
    if (ghostSpeed > CRUISE_SPEED) {
      const f = Math.max(CRUISE_SPEED / ghostSpeed, FRICTION);
      ghost.xDir *= f;
      ghost.yDir *= f;
    } else if (ghostSpeed < 1) {
      const angle = Math.random() * Math.PI * 2; //don't let the ghost get stuck
      ghost.xDir = Math.cos(angle) * CRUISE_SPEED * 0.8;
      ghost.yDir = Math.sin(angle) * CRUISE_SPEED * 0.8;
    }

    ghost.xPos += ghost.xDir;
    ghost.yPos += ghost.yDir;

    const maxX = window.innerWidth - img.offsetWidth;
    const maxY = window.innerHeight - img.offsetHeight;
    if (ghost.xPos < 0 || ghost.xPos > maxX) {
      ghost.xDir *= -1;
      ghost.xPos = Math.max(0, Math.min(ghost.xPos, maxX));
    }
    if (ghost.yPos < 0 || ghost.yPos > maxY) {
      ghost.yDir *= -1;
      ghost.yPos = Math.max(0, Math.min(ghost.yPos, maxY));
    }

    img.style.left = ghost.xPos + "px";
    img.style.top = ghost.yPos + "px";
    requestAnimationFrame(ghostMove);
  }
  requestAnimationFrame(ghostMove);
}

const chaosTiers = [
  { at: 3 * 60, message: "Chaos level 1: decoy buttons", apply: addDecoys },
  { at: 5 * 60, message: "Chaos level 2: is the room spinning?", apply: startSpin },
  { at: 15 * 60, message: "Chaos level 3: a friend joins you", apply: spawnGhost }
];

let appliedTiers = 0;

function checkChaos(silent) {
  while (appliedTiers < chaosTiers.length && time >= chaosTiers[appliedTiers].at) {
    const tier = chaosTiers[appliedTiers++];
    tier.apply();
    if (!silent) announce(tier.message);
  }
}

checkChaos(true); //restore tiers after a reload
setInterval(checkChaos, 1000);

/* ---------- Idle detection ---------- */

const IDLE_AFTER_MS = 30 * 1000;
const SHOUT_EVERY_MS = 6 * 1000;

const idleMessages = [
  "ARE YOU EVEN THERE?",
  "HELLO?? THE THESIS IS CALLING",
  "I CAN WAIT ALL DAY. SO CAN YOUR DEADLINE.",
  "BLINK IF YOU NEED HELP",
  "THE GIF IS WATCHING YOU"
];

const shout = document.createElement("div");
shout.id = "shout";
document.body.appendChild(shout);

let lastActivity = Date.now();
let lastShout = 0;
let shouting = false;

function onActivity() {
  lastActivity = Date.now();
  if (shouting) {
    shouting = false;
    shout.classList.remove("show");
  }
}

["pointermove", "pointerdown", "keydown", "wheel", "touchstart"].forEach(function(name) {
  window.addEventListener(name, onActivity, { passive: true });
});

function shoutSomething() {
  shout.textContent = idleMessages[Math.floor(Math.random() * idleMessages.length)];
  shout.classList.add("show");
  shouting = true;
  lastShout = Date.now();
}

setInterval(function() {
  if (document.hidden) return;
  const now = Date.now();
  if (now - lastActivity > IDLE_AFTER_MS && now - lastShout > SHOUT_EVERY_MS) {
    shoutSomething();
  }
}, 1000);


/* ---------- Gravity ---------- */

const GRAVITY = 0.25; //px per frame, per frame
const FLOOR_BOUNCE = 0.8;
const WALL_BOUNCE = 0.9;
let gravityOn = false;

function applyGravity() {
  const floor = window.innerHeight - gif.offsetHeight;
  const resting = gif.yPos >= floor - 0.5 && Math.abs(gif.yDir) < 0.01;

  if (resting) {
    gif.yPos = floor;
    gif.xDir *= 0.98; //floor friction
    if (Math.abs(gif.xDir) < 0.05) gif.xDir = 0;
  } else {
    gif.yDir += GRAVITY;
  }
  gif.xDir *= 0.9995; //air drag
}

function setGravity(on) {
  gravityOn = on;
  gravityBtn.setAttribute("aria-pressed", on);
  gravityBtn.classList.toggle("active", on);
  if (!on && Math.hypot(gif.xDir, gif.yDir) < 0.5) {
    const angle = Math.random() * Math.PI * 2; //kick it back into motion
    gif.xDir = Math.cos(angle) * CRUISE_SPEED;
    gif.yDir = Math.sin(angle) * CRUISE_SPEED;
  }
  announce(on ? "Gravity: on" : "Gravity: off");
}

/* ---------- Gif interactions ---------- */

const SCATTER_MIN_SPEED = 4;
let lastScatter = 0;
let lastCollision = 0;

function checkGifInteractions() {
  const now = performance.now();
  const w = gif.offsetWidth;
  const h = gif.offsetHeight;

  /*Throw the gif at the buttons and they scatter*/
  if (Math.hypot(gif.xDir, gif.yDir) > SCATTER_MIN_SPEED && now - lastScatter > 800) {
    const r = btnContainer.getBoundingClientRect();
    if (gif.xPos < r.right && gif.xPos + w > r.left && gif.yPos < r.bottom && gif.yPos + h > r.top) {
      lastScatter = now;
      dodgeButtons();
      blip();
    }
  }

  /*Gif vs ghost: swap momentum and push them apart*/
  if (ghost && now - lastCollision > 300) {
    const gw = ghost.el.offsetWidth;
    const gh = ghost.el.offsetHeight;
    const ox = Math.min(gif.xPos + w, ghost.xPos + gw) - Math.max(gif.xPos, ghost.xPos);
    const oy = Math.min(gif.yPos + h, ghost.yPos + gh) - Math.max(gif.yPos, ghost.yPos);

    if (ox > 0 && oy > 0) {
      lastCollision = now;
      const tx = gif.xDir;
      const ty = gif.yDir;
      gif.xDir = ghost.xDir;
      gif.yDir = ghost.yDir;
      ghost.xDir = tx;
      ghost.yDir = ty;

      if (ox < oy) {
        const dir = gif.xPos < ghost.xPos ? -1 : 1;
        gif.xPos += dir * ox / 2;
        ghost.xPos -= dir * ox / 2;
      } else {
        const dir = gif.yPos < ghost.yPos ? -1 : 1;
        gif.yPos += dir * oy / 2;
        ghost.yPos -= dir * oy / 2;
      }
      blip();
    }
  }
}

/* ---------- Sound ---------- */

/*Everything is synthesised with the Web Audio API, no audio files.
  A low drone gets higher, faster and louder the longer you waste time.*/
let audio = null;
let soundOn = false;

function intensity() {
  return Math.min(1, time / (20 * 60));
}

function createAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  filter.connect(master);

  const tremolo = ctx.createGain();
  tremolo.gain.value = 0.7;
  tremolo.connect(filter);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 3;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.3;
  lfo.connect(lfoDepth);
  lfoDepth.connect(tremolo.gain);
  lfo.start();

  const oscs = [0, 7].map(function(detune) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.detune.value = detune;
    osc.frequency.value = 55;
    osc.connect(tremolo);
    osc.start();
    return osc;
  });

  return { ctx: ctx, master: master, oscs: oscs, lfo: lfo, filter: filter };
}

function updateSound() {
  if (!audio) return;
  const t = audio.ctx.currentTime;
  const level = intensity();
  audio.oscs.forEach(function(osc) {
    osc.frequency.setTargetAtTime(55 + level * 55, t, 0.5);
  });
  audio.lfo.frequency.setTargetAtTime(2 + level * 6, t, 0.5);
  audio.filter.frequency.setTargetAtTime(400 + level * 1200, t, 0.5);
  audio.master.gain.setTargetAtTime(soundOn ? 0.03 + level * 0.1 : 0, t, 0.1);
}

function setSound(on) {
  if (on && !audio) audio = createAudio();
  if (on && !audio) return; //not supported
  soundOn = on;
  if (audio && on) audio.ctx.resume();
  soundBtn.textContent = on ? "🔊" : "🔇";
  soundBtn.setAttribute("aria-pressed", on);
  updateSound();
}

/*Short thud when the gif hits something*/
function blip() {
  if (!audio || !soundOn) return;
  const t = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.1);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain);
  gain.connect(audio.ctx.destination);
  osc.start(t);
  osc.stop(t + 0.13);
}

setInterval(updateSound, 1000);

/* ---------- Controls ---------- */

const controls = document.createElement("div");
controls.id = "controls";

const soundBtn = document.createElement("button");
soundBtn.textContent = "🔇";
soundBtn.title = "Sound (off by default)";
soundBtn.setAttribute("aria-label", "Toggle sound");
soundBtn.setAttribute("aria-pressed", "false");
soundBtn.addEventListener("click", function() {
  setSound(!soundOn);
});

const gravityBtn = document.createElement("button");
gravityBtn.textContent = "⬇️";
gravityBtn.title = "Gravity (G)";
gravityBtn.setAttribute("aria-label", "Toggle gravity");
gravityBtn.setAttribute("aria-pressed", "false");
gravityBtn.addEventListener("click", function() {
  setGravity(!gravityOn);
});

window.addEventListener("keydown", function(event) {
  if ((event.key === "g" || event.key === "G") && !popupOpen && !event.metaKey && !event.ctrlKey) {
    setGravity(!gravityOn);
  }
});

controls.appendChild(soundBtn);
controls.appendChild(gravityBtn);
document.body.appendChild(controls);
