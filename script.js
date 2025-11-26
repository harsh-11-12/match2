// ----------------------
// CONFIG
// ----------------------
const PHOTOS = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg"
];

const VIDEO_FILE = "images/video.mp4";
const MUSIC_FILE = "images/bg-music.mp3";

const CAPTIONS = [
  "Our first memory together: 22nd July 2025 ❤️",
  "Our First random and fun ride",
  "Third Meeting, where someone interrupted our space",
  "6-Aug, i grabbed you<3(hehehehe)",
  "Our first food date(kfc), hehehe"
];

// ----------------------
// DOM ELEMENTS
// ----------------------
const preloader = document.getElementById("preloader");
const surpriseVideo = document.getElementById("surpriseVideo");
const slideshowEl = document.getElementById("slideshow");
const dotsEl = document.getElementById("dots");
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

const screens = {
  s1: document.getElementById("s1"),
  s2: document.getElementById("s2"),
  s3: document.getElementById("s3"),
  s4: document.getElementById("s4"),
  s5: document.getElementById("s5")
};

// ----------------------
// HELPERS
// ----------------------
function showScreen(id) {
  Object.values(screens).forEach(s => {
    s.classList.remove("active");
    s.setAttribute("aria-hidden", "true");
  });
  screens[id].classList.add("active");
  screens[id].setAttribute("aria-hidden", "false");
}

window.addEventListener("load", () => {
  setTimeout(() => preloader.classList.add("hidden"), 1500);
});

// ----------------------
// BUTTON EVENTS
// ----------------------
document.getElementById("startBtn").onclick = () => showScreen("s2");
document.getElementById("back1").onclick = () => showScreen("s1");
document.getElementById("toSurprise").onclick = () => showScreen("s3");

document.getElementById("playVideoBtn").onclick = async () => {
  surpriseVideo.muted = false;        // ← This is the key!
  try {
    await surpriseVideo.play();
    document.getElementById("playVideoBtn").textContent = "Playing…";
    document.getElementById("playVideoBtn").disabled = true;
  } catch (err) {
    alert("Please tap the video itself to play with sound!");
  }
};

document.getElementById("fullscreenBtn").onclick = () => {
  if (surpriseVideo.requestFullscreen) {
    surpriseVideo.requestFullscreen();
  } else if (surpriseVideo.webkitEnterFullscreen) {  // iPhone
    surpriseVideo.webkitEnterFullscreen();
  } else if (surpriseVideo.msRequestFullscreen) {
    surpriseVideo.msRequestFullscreen();
  }
};

document.getElementById("skipToSlideshow").onclick = () => {
  initSlideshow();
  showScreen("s4");
};

// ----------------------
// SLIDESHOW
// ----------------------
let slideIndex = 0;
let slideTimer = null;

function initSlideshow() {
  if (slideshowEl.dataset.ready === "1") return;
  slideshowEl.dataset.ready = "1";

  PHOTOS.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url("${src}")`;

    const cap = document.createElement("div");
    cap.className = "caption";
    cap.textContent = CAPTIONS[i] || `Memory ${i + 1}`;
    slide.appendChild(cap);
    slideshowEl.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "small-dot";
    dot.onclick = () => gotoSlide(i);
    dotsEl.appendChild(dot);
  });

  gotoSlide(0);
  slideTimer = setInterval(() => {
    gotoSlide((slideIndex + 1) % PHOTOS.length);
  }, 3500);
}

function gotoSlide(i) {
  slideIndex = i;
  const slides = slideshowEl.querySelectorAll(".slide");
  const dots = dotsEl.querySelectorAll(".small-dot");
  slides.forEach(s => s.classList.remove("show"));
  dots.forEach(d => d.classList.remove("active"));
  slides[i].classList.add("show");
  dots[i].classList.add("active");
}

document.getElementById("toFinalBtn").onclick = showFinal;
document.getElementById("backFromSlide").onclick = () => showScreen("s3");

// ----------------------
// FINAL SCREEN
// ----------------------
function showFinal() {
  showScreen("s5");
  bgMusic.src = MUSIC_FILE;
  bgMusic.play().catch(() => {});
  startParticles();

  // Reset mute button
  bgMusic.muted = false;
  muteBtn.textContent = "Unmute";
  muteBtn.classList.remove("muted");
}

document.getElementById("replayBtn").onclick = () => {
  showScreen("s1");
  bgMusic.pause();
  bgMusic.currentTime = 0;
  if (slideTimer) clearInterval(slideTimer);
};

// Mute toggle
muteBtn.onclick = () => {
  bgMusic.muted = !bgMusic.muted;
  muteBtn.textContent = bgMusic.muted ? "Muted" : "Unmute";
  muteBtn.classList.toggle("muted", bgMusic.muted);
};

// ----------------------
// PARTICLES
// ----------------------
function startParticles() {
  const box = document.getElementById("particles");
  let count = 0;
  const max = 24;
  const interval = setInterval(() => {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 10 + Math.random() * 22;
    p.style.width = p.style.height = size + "px";
    p.style.left = Math.random() * 90 + 5 + "%";
    p.style.animationDuration = 3 + Math.random() * 3 + "s";
    box.appendChild(p);
    setTimeout(() => p.remove(), 7000);
    if (++count > max) clearInterval(interval);
  }, 220);
}

// Keyboard support
["startBtn","toSurprise","playVideoBtn","toFinalBtn","replayBtn"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") el.click();
  });
});


surpriseVideo.addEventListener("ended", () => {
  bgMusic.muted = false;
  initSlideshow();
  showScreen("s4");
});

// Skip button → also restore music
document.getElementById("skipToSlideshow").onclick = () => {
  surpriseVideo.pause();
  bgMusic.muted = false;
  initSlideshow();
  showScreen("s4");
};
