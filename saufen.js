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

function onWater() {
    document.body.classList.add('chosen');
    beer.style.display = 'none';
}

function onBeer() {
    document.body.classList.add('chosen');
    resize.style.display = 'none';
    water.style.display = 'none';
}

function onStart(e) {
    separator.classList.add('draggable');
    document.body.classList.add('dragging');

    // Check if it's a mouse or touch event and pass along the correct value
    let start = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;

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
    let move = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;
    let left = move + pos - dragWidth;

    // Prevent going off limits
    if (left < minLeft) {
        left = minLeft;
    } else if (left > maxLeft) {
        left = maxLeft;
    }

    // Translate the separator's left value to masked divs width.
    let fac = (left + dragWidth / 2 - containerOffset) * 100 / containerWidth;
    let width = fac + '%';

    if (fac < 5) {
        onEnd();
        onBeer();
    } else if (fac > 95) {
        onEnd();
        onWater();
    }

    // Set the new values for the slider and the separator.
    separator.style.left = width;
    resize.style.width = width;
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
}

if (document.readyState === 'complete') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
