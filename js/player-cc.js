var playerButtons = [
  { id: 0, name: 'fastRewind', element: null },
  { id: 1, name: 'quickRewind', element: null },
  { id: 2, name: 'playPause', element: null },
  { id: 3, name: 'quickForward', element: null },
  { id: 4, name: 'fastForward', element: null },
  { id: 5, name: 'captions', element: null },
  { id: 6, name: 'captionsModuleClose', element: null }
];

var container = document.getElementById('rmp');
var currentActiveButtonId, isPaused;

var _createEvent = function (eventName, element) {
  var event;
  if (element) {
    try {
      event = new Event(eventName);
      element.dispatchEvent(event);
    } catch (e) {
      console.trace(e);
    }
  }
};

// handle requests from TV remote
var _removeHoverClass = function () {
  for (var i = 0, len = playerButtons.length; i < len; i++) {
    playerButtons[i].element.classList.remove('rmp-button-hover');
  }
};

var _setActiveButton = function (id) {
  _removeHoverClass();
  currentActiveButtonId = id;
  playerButtons[id].element.classList.add('rmp-button-hover');
};

var moduleVisible = false;
var _handleButtons = function (keyCode) {
  moduleVisible = window.rmp.getModuleOverlayVisible('captions');
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
        if (newId > 5) {
          newId = 0;
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
        if (newId > 5) {
          newId = 5;
        }
      }
      break;
  }
  console.log(newId);
  _setActiveButton(newId);
};

var _triggerButton = function () {
  var currentActiveButton = container.querySelector('.rmp-button-hover');
  _createEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
var _onKeyDown = function (e) {
  var currentTime = window.rmp.getCurrentTime();
  var keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  window.rmp.setControlsVisible(true);
  switch (keyCode) {
    case 412: // MediaRewind 
      window.rmp.seekTo(currentTime - 10000);
      break;
    case 417: // MediaFastForward 
      window.rmp.seekTo(currentTime + 10000);
      break;
    case 10009: // Back
      window.location.replace('index.html');
      break;
    case 415: // MediaPlay
      window.rmp.play();
      break;
    case 19: // MediaPause
      window.rmp.pause();
      break;
    case 413: // MediaStop
      window.rmp.stop();
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
      isPaused = window.rmp.getPaused();
      if (isPaused) {
        window.rmp.play();
      } else {
        window.rmp.pause();
      }
      break;
    default:
      break;
  }
};

// register additional keys as per https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
var _registerKey = function () {
  try {
    var value = tizen.tvinputdevice.getSupportedKeys();
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

_registerKey();
document.body.addEventListener('keydown', _onKeyDown);

// when player is ready we wire the UI
container.addEventListener('loadeddata', function () {
  playerButtons[0].element = container.querySelector('.rmp-fast-rewind');
  playerButtons[0].element.setAttribute('data-button-id', '0');
  playerButtons[1].element = container.querySelector('.rmp-i-quick-rewind-tv');
  playerButtons[1].element.setAttribute('data-button-id', '1');
  playerButtons[2].element = container.querySelector('.rmp-play-pause');
  playerButtons[2].element.setAttribute('data-button-id', '2');
  playerButtons[3].element = container.querySelector('.rmp-i-quick-forward-tv');
  playerButtons[3].element.setAttribute('data-button-id', '3');
  playerButtons[4].element = container.querySelector('.rmp-fast-forward');
  playerButtons[4].element.setAttribute('data-button-id', '4');
  _setActiveButton(2);
});

// captions tracks module is available
container.addEventListener('alltexttracksloaded', function () {
  playerButtons[5].element = container.querySelector('.rmp-captions');
  playerButtons[5].element.setAttribute('data-button-id', '5');
  playerButtons[6].element = container.querySelector('.rmp-module-overlay-icons.rmp-module-overlay-close');
  playerButtons[6].element.setAttribute('data-button-id', '6');
  var textTracks = container.querySelectorAll('.rmp-overlay-levels-area > .rmp-button.rmp-overlay-level');
  if (textTracks.length > 0) {
    for (var i = 0, len = textTracks.length; i < len; i++) {
      var id = 6 + i + 1;
      var button = textTracks[i];
      button.setAttribute('data-button-id', '' + id + '');
      var lng = button.getAttribute('aria-label');
      playerButtons.push(
        { id: id, name: lng, element: button }
      );
    }
  }

  playerButtons[5].element.addEventListener('click', function () {
    _setActiveButton(7);
  });
});
