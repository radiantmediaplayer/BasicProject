
// handle requests from TV remote
var currentAElement;
var currentIndex = 0;

var _handleButtons = function () {
  var aElements = document.querySelectorAll('a');
  if (!currentAElement) {
    currentAElement = aElements[currentIndex];
  } else {
    currentIndex++;
    if (!aElements[currentIndex]) {
      currentIndex = 0;
    }
    currentAElement = aElements[currentIndex];
  }
  currentAElement.focus();
};

var _triggerButton = function () {
  currentAElement.click();
};

// when TV remote 
var _onKeyDown = function (e) {
  var keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  switch (keyCode) {
    case 39: // Right arrow
    case 37: // Left arrow
    case 38: // UP arrow
    case 40: // DOWN arrow
      _handleButtons();
      break;
    case 13: // Enter
      _triggerButton();
      break;
  }
};

// when player is ready we wire the UI
document.addEventListener('keydown', _onKeyDown);
