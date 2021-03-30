/* 0 == playPause button
*/
var playerButtons = [
  { id: 0, name: 'playPause', element: null }
];

var container = document.getElementById('rmpPlayer');
var currentActiveButtonId, rmpFW, rmp, isPaused;
var currentActiveButton;

// handle requests from TV remote
var _removeHoverClass = function () {
  for (var i = 0, len = playerButtons.length; i < len; i++) {
    rmpFW.removeClass(playerButtons[i].element, 'rmp-button-hover');
  }
};

var _setActiveButton = function (id) {
  currentActiveButtonId = id;
  rmpFW.addClass(playerButtons[id].element, 'rmp-button-hover');
};

var _handleButtons = function (keyCode) {
  currentActiveButton = container.querySelector('.rmp-button-hover');
  _removeHoverClass();
  var newId;
  switch (keyCode) {
    case 38: // ArrowUp
    case 39: // ArrowRight
      if (playerButtons[currentActiveButtonId + 1]) {
        newId = currentActiveButtonId + 1;
      } else {
        newId = 0;
      }
      break;
    case 37: // ArrowLeft
    case 40: // ArrowDown
      if (playerButtons[currentActiveButtonId - 1]) {
        newId = currentActiveButtonId - 1;
      } else {
        newId = playerButtons.length - 1;
      }
      break;
  }
  _setActiveButton(newId);
};

var _triggerButton = function () {
  currentActiveButton = container.querySelector('.rmp-button-hover');
  rmpFW.createStdEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
// we deal with 2 kind of remote: Basic Device, Smart Control 2016

var _onKeyDown = function (e) {
  var currentTime = rmp.getCurrentTime();
  var keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  rmp.setControlsVisible(true);
  switch (keyCode) {
    case 412: // MediaRewind 
      rmp.seekTo(currentTime - 10000);
      break;
    case 417: // MediaFastForward 
      rmp.seekTo(currentTime + 10000);
      break;
      break;
    case 10009: // Back
      window.location.replace('index.html');
      break;
    case 415: // MediaPlay
      rmp.play();
      break;
    case 19: // MediaPause
      rmp.pause();
      break;
    case 413: // MediaStop
      rmp.stop();
      break;
    case 37: // ArrowLeft
    case 38: // ArrowUp
    case 39: // ArrowRight
    case 40: // ArrowDown
      _handleButtons(keyCode);
      break;
    case 13: // Enter
      _triggerButton();
      break;
    case 10252: // MediaPlayPause
      isPaused = rmp.getPaused();
      if (isPaused) {
        rmp.play();
      } else {
        rmp.pause();
      }
      break;
    default:
      break;
  }
};

// register additional keys as per https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
const _registerKey = function () {
  try {
    const value = tizen.tvinputdevice.getSupportedKeys();
    window.console.log(value);
    tizen.tvinputdevice.registerKeyBatch([
      'MediaPlayPause',
      'MediaRewind',
      'MediaFastForward',
      'MediaPlay',
      'MediaPause',
      'MediaStop'
    ]);
  } catch (e) {
    window.console.log(e);
  }
};

// when player is ready we wire the UI
container.addEventListener('ready', function () {
  rmp = window.rmp;
  playerButtons[0].element = container.querySelector('.rmp-play-pause');
  playerButtons[0].element.setAttribute('data-button-id', '0');
  rmpFW = rmp.getFramework();
  _registerKey();
  document.body.addEventListener('keydown', _onKeyDown);
  _setActiveButton(0);
  currentActiveButton = container.querySelector('.rmp-button-hover');
});
