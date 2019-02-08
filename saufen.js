let separator;
let resize;
let dragWidth;
let pos;
let containerOffset;
let containerWidth;
let minLeft;
let maxLeft;
let water;
let beer;
let width;

function onWater() {
  document.body.classList.add('chosen');
  beer.style.display = 'none';
  separator.style.display = 'none';
}

function onBeer() {
  document.body.classList.add('chosen');
  resize.style.display = 'none';
  water.style.display = 'none';
  separator.style.display = 'none';
}

function goBack() {
  document.body.classList.remove('chosen');
  resize.style.display = '';
  beer.style.display = '';
  water.style.display = '';
  document.body.classList.add('animate');

  window.requestAnimationFrame(function() {
    width = '50%';

    setTimeout(function() {
      document.body.classList.remove('animate');
      separator.style.display = '';
    }, 300);
  });
}

function copyToClipboard(e) {
  let text = e.target.previousElementSibling.href;
  for (let button of document.querySelectorAll('button.copy')) {
    button.classList.remove('success');
    button.classList.remove('error');
  }

  navigator.clipboard.writeText(text).then(function () {
    e.target.classList.add('success');
  }, function() {
    e.target.classList.add('error');
  });
}

function onStart(e) {
  separator.classList.add('draggable');
  document.body.classList.add('dragging');

  // Check if it's a mouse or touch event and pass along the correct value
  let start = (e.pageX) ? e.pageX : e.changedTouches[0].pageX;

  // Get the initial position
  dragWidth = separator.offsetWidth;
  pos = separator.offsetLeft + dragWidth - start;
  containerOffset = document.body.offsetLeft;
  containerWidth = document.body.offsetWidth;

  // Set limits
  minLeft = containerOffset + 10;
  maxLeft = containerOffset + containerWidth - dragWidth - 10;

  document.body.onmousemove = onMove;
  document.body.ontouchmove = onMove;

  e.preventDefault();
}

function onMove(e) {
  // Check if it's a mouse or touch event and pass along the correct value
  let move = (e.pageX) ? e.pageX : e.changedTouches[0].pageX;
  let left = move + pos - dragWidth;

  // Prevent going off limits
  if (left < minLeft) {
    left = minLeft;
  } else if (left > maxLeft) {
    left = maxLeft;
  }

  // Translate the separator's left value to masked divs width.
  let fac = (left + dragWidth / 2 - containerOffset) * 100 / containerWidth;
  width = fac + '%';

  if (fac < 10) {
    onEnd();
    onBeer();
  } else if (fac > 90) {
    onEnd();
    onWater();
  }
}

function onEnd() {
  separator.classList.remove('draggable');
  document.body.classList.remove('dragging');

  document.body.onmousemove = null;
  document.body.ontouchmove = null;
}

function init() {
  separator = document.querySelector('.separator');
  resize = document.querySelector('.resize');
  water = document.querySelector('.water');
  beer = document.querySelector('.beer');

  separator.onmousedown = onStart;
  separator.ontouchstart = onStart;

  document.body.onmouseup = onEnd;
  document.body.ontouchend = onEnd;
  document.body.onmouseleave = onEnd;

  let backButtons = document.querySelectorAll('button.back');
  for (let button of backButtons) {
    button.onclick = goBack;
  }

  let copyButtons = document.querySelectorAll('button.copy');
  for (let button of copyButtons) {
    button.onclick = copyToClipboard;
  }

  setInterval(function () {
    if (!!width) {
      // Set the new values for the slider and the separator.
      separator.style.left = width;
      resize.style.width = width;
    }
  }, 1000 / 60);
}

if (document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
