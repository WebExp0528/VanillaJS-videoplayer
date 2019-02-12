const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const points = player.querySelectorAll('[data-point]');
const timeupdate = player.querySelector('.time-update');
const timepreview = player.querySelector('.time-preview');
const fullscreen = player.querySelector('.fullscreen');
const playbackRate = player.querySelector('.playback-rate');

function togglePlay() {
  const method = video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  const rate = this.name == 'playbackRate' ? playbackRate.textContent = `${this.value}x` : '';
}

function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

function setPoint(e) {
  this.dataset.point = this.dataset.point == '' ? video.currentTime : '';
  const style = this.dataset.point > 0 
    ? this.classList.add('activeButton') 
    : this.classList.remove('activeButton');
}

function loopPoints() {
  if (points[0].dataset.point > 0 && 
      points[1].dataset.point > 0 && 
      (video.currentTime > points[1].dataset.point)) {
        video.currentTime = points[0].dataset.point;
        video.play();
  }
}

points.forEach(button => button.addEventListener('click', setPoint));
video.addEventListener("timeupdate", loopPoints);

function takeTime(secs) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if (hr < 10)  { hr  = "0" + hr; }
  if (min < 10) { min = "0" + min; }
  if (sec < 10) { sec = "0" + sec; }

  if (hr > 0) {
    return hr + ':' + min + ':' + sec;
  } else {
    return min + ':' + sec;
  }
}

function timeUpdate() {
  timeupdate.textContent = takeTime(video.currentTime) + ' / ' + takeTime(video.duration);
}
video.addEventListener("timeupdate", timeUpdate);

function timePreview(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  timepreview.style.left = `${(scrubTime / video.duration * 100) - 4}%`;
  return timepreview.textContent = takeTime(scrubTime);
}
progress.addEventListener("mousemove", (e) => timePreview(e));

function toggleFullScreen() {
  const method = document.webkitFullscreenElement 
    ? document.webkitExitFullscreen() 
    : player.webkitRequestFullscreen();
};

function updateButtonFullScr() {
  if (!document.webkitFullscreenElement) { 
      fullscreen.classList.remove('fa-compress');
      fullscreen.classList.add('fa-expand'); 
  } else { 
      fullscreen.classList.remove('fa-expand');
      fullscreen.classList.add('fa-compress');
  } 
}

fullscreen.addEventListener("click", toggleFullScreen);
document.addEventListener("webkitfullscreenchange", updateButtonFullScr);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
