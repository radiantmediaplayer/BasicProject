// handle requests from TV remote
let currentAElement;
let currentIndex = 0;

const _handleButtons = function (type) {
  const aElements = document.querySelectorAll('a');
  if (!currentAElement) {
    currentAElement = aElements[0];
  } else {
    if (type === 'next') {
      currentIndex++;
    } else {
      currentIndex--;
    }
    if (!aElements[currentIndex]) {
      if (type === 'next') {
        currentIndex = 0;
      } else {
        currentIndex = aElements.length - 1;
      }
    }
    window.console.log('currentIndex: ' + currentIndex);
    currentAElement = aElements[currentIndex];
  }
  currentAElement.focus();
};

const _triggerButton = function () {
  currentAElement.click();
};

// when TV remote
const _onKeyDown = function (e) {
  const keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  switch (keyCode) {
    case 39: // Right arrow
    case 40: // Down arrow
      _handleButtons('next');
      break;
    case 37: // Left arrow
    case 38: // Up arrow
      _handleButtons('previous');
      break;
    case 13: // Enter
      _triggerButton();
      break;
    case 10009: // Back >> exit app
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (e) {
        window.console.log(e);
      }
      break;
  }
};

// when player is ready we wire the UI
document.addEventListener('keydown', _onKeyDown);
