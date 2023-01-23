var playerButtons = [
  { name: 'fastRewind', element: null },
  { name: 'quickRewind', element: null },
  { name: 'playPause', element: null },
  { name: 'quickForward', element: null },
  { name: 'fastForward', element: null }
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
    if (playerButtons[i].element) {
      playerButtons[i].element.classList.remove('rmp-button-hover');
    }
  }
};

var _setActiveButton = function (id) {
  currentActiveButtonId = id;
  if (playerButtons[id].element) {
    playerButtons[id].element.classList.add('rmp-button-hover');
  }
  window.rmp.setControlsVisible(true);
};

var _handleButtons = function (keyCode) {
  // if no active button, we default to play button
  var currentActiveButton = container.querySelector('.rmp-button-hover');
  if (!currentActiveButton) {
    _setActiveButton(2);
    return;
  }
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
  var currentActiveButton = container.querySelector('.rmp-button-hover');
  _createEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
var _onKeyDown = function (e) {
  var currentTime = window.rmp.getCurrentTime();
  var keyCode = e.keyCode;
  console.log('Key code called : ' + keyCode);
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
      // ad on stage - if skippable focus is on skip button 
      // otherwise the ad plays without remote interaction
      if (!window.rmp.getAdOnStage()) {
        _handleButtons(keyCode);
      }
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
    console.log(value);
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

document.body.addEventListener('keydown', _onKeyDown);
_registerKey();

// when player reaches loadeddata we wire the UI
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
});

container.addEventListener('adstarted', function () {
  var skipButton = {
    name: 'skipAd',
    element: container.querySelector('.rmp-ad-container-skip')
  };
  if (skipButton.element) {
    playerButtons.push(skipButton);
    skipButton.element.setAttribute('data-button-id', '5');
    _setActiveButton(5);
  }
});

container.addEventListener('addestroyed', function () {
  // remove skip button if needs be
  if (playerButtons.length === 6) {
    playerButtons.pop();
  }
  setTimeout(function () {
    _setActiveButton(2);
  }, 1000);
});
