/* 0 == quickRewind button, 
1 == playPause button, 
2 == quickForward button
3 == audio module button
4 == audio module close button
*/
var playerButtons = [
  { id: 0, name: 'quickRewind', element: null },
  { id: 1, name: 'playPause', element: null },
  { id: 2, name: 'quickForward', element: null },
  { id: 3, name: 'audio', element: null },
  { id: 4, name: 'audioModuleClose', element: null }
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

var moduleVisible = false;
var _handleButtons = function (keyCode) {
  currentActiveButton = container.querySelector('.rmp-button-hover');
  moduleVisible = rmp.getModuleOverlayVisible('audio');
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
      if (!moduleVisible) {
        if (newId > 3) {
          newId = 0;
        }
      } else {
        if (newId === 3) {
          newId = 4;
        }
      }
      break;
    case 37: // ArrowLeft
    case 40: // ArrowDown
      if (playerButtons[currentActiveButtonId - 1]) {
        newId = currentActiveButtonId - 1;
      } else {
        newId = playerButtons.length - 1;
      }
      if (!moduleVisible) {
        if (newId > 3) {
          newId = 3;
        }
      } else {
        if (newId === 3) {
          newId = 2;
        }
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
  playerButtons[0].element = container.querySelector('.rmp-i-quick-rewind-tv');
  playerButtons[0].element.setAttribute('data-button-id', '0');
  playerButtons[1].element = container.querySelector('.rmp-play-pause');
  playerButtons[1].element.setAttribute('data-button-id', '1');
  playerButtons[2].element = container.querySelector('.rmp-i-quick-forward-tv');
  playerButtons[2].element.setAttribute('data-button-id', '2');
  rmpFW = rmp.getFramework();
  _registerKey();
  document.body.addEventListener('keydown', _onKeyDown);
  _setActiveButton(1);
  currentActiveButton = container.querySelector('.rmp-button-hover');
});

// audio tracks module is available
container.addEventListener('shakatrackschanged', function () {
  playerButtons[3].element = container.querySelector('.rmp-audio');
  playerButtons[3].element.setAttribute('data-button-id', '3');
  playerButtons[4].element = container.querySelector('.rmp-module-overlay-icons.rmp-module-overlay-close');
  playerButtons[4].element.setAttribute('data-button-id', '4');
  var audioTracks = container.querySelectorAll('.rmp-overlay-levels-area > .rmp-button.rmp-overlay-level');
  if (audioTracks.length > 0) {
    for (let i = 0, len = audioTracks.length; i < len; i++) {
      const id = 4 + i + 1;
      const button = audioTracks[i];
      button.setAttribute('data-button-id', '' + id + '');
      const lng = button.getAttribute('aria-label');
      playerButtons.push(
        { id: id, name: lng, element: button }
      );
    }
  }
});
