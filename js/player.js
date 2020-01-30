// 0 == quickRewind button, 1 == playPause button, 2 == quickForward button
var playerButtons = [
  { id: 0, mane: 'quickRewind', element: null },
  { id: 1, name: 'playPause', element: null },
  { id: 2, name: 'quickForward', element: null }
];
var container = document.getElementById('rmpPlayer');
var currentCaptionLng, currentCaptionIndex, currentActiveButtonId, rmpFW, rmp, isPaused;

// in case captions are available we handle requests from the TV remote caption button
var _handleCaptions = function () {
  var captions = rmp.getCaptionsList();
  if (captions) {
    var captionsLits = [];
    currentCaptionLng = rmp.getCCVisibleLanguage();
    currentCaptionIndex = captions.findIndex(function (caption) {
      return caption[0] === currentCaptionLng;
    });
    for (var i = 0, len = captions.length; i < len; i++) {
      captionsLits.push(captions[i][0]);
    }
    var finalIndex = 'off';
    if (captionsLits[currentCaptionIndex + 1]) {
      finalIndex = captionsLits[currentCaptionIndex + 1];
    }
    rmp.showCaptions(finalIndex);
  }
};

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
  var currentActiveButton = container.querySelector('.rmp-button-hover');
  if (currentActiveButton === null) {
    _setActiveButton(1);
  } else {
    currentActiveButtonId = parseInt(currentActiveButton.getAttribute('data-button-id'));
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
  }
};

var _triggerButton = function () {
  var currentActiveButton = container.querySelector('.rmp-button-hover');
  rmpFW.createStdEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
// we deal with 2 kind of remote: Basic Device, Smart Control 2016
var getSupportedKeys;
try {
  getSupportedKeys = tizen.tvinputdevice.getSupportedKeys();
  window.console.log(getSupportedKeys);
  tizen.tvinputdevice.registerKey('MediaPlayPause');
  tizen.tvinputdevice.registerKey('MediaRewind');
  tizen.tvinputdevice.registerKey('MediaFastForward');
  tizen.tvinputdevice.registerKey('MediaPlay');
  tizen.tvinputdevice.registerKey('MediaPause');
  tizen.tvinputdevice.registerKey('MediaStop');
  tizen.tvinputdevice.registerKey('Back');
  tizen.tvinputdevice.registerKey('ArrowLeft');
  tizen.tvinputdevice.registerKey('ArrowUp');
  tizen.tvinputdevice.registerKey('ArrowRight');
  tizen.tvinputdevice.registerKey('ArrowDown');
  tizen.tvinputdevice.registerKey('Enter');
  tizen.tvinputdevice.registerKey('Caption');
  tizen.tvinputdevice.registerKey('ColorF0Red');
} catch (e) {
  window.console.log(e);
}

var _onKeyDown = function (e) {
  var currentTime = rmp.getCurrentTime();
  var keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  rmp.setControlsVisible(true);
  if (getSupportedKeys) {
    window.console.log(tizen.tvinputdevice.getKey('MediaRewind').code);
    switch (keyCode) {
      case tizen.tvinputdevice.getKey('MediaRewind').code:
        rmp.seekTo(currentTime - 10000);
        break;
      case tizen.tvinputdevice.getKey('MediaFastForward').code:
        rmp.seekTo(currentTime + 10000);
        break;
      case tizen.tvinputdevice.getKey('Caption').code:
      case tizen.tvinputdevice.getKey('ColorF0Red').code:
        _handleCaptions();
        break;
      case tizen.tvinputdevice.getKey('Back').code:
        window.location.replace('index.html');
        break;
      case tizen.tvinputdevice.getKey('MediaPlay').code:
        rmp.play();
        break;
      case tizen.tvinputdevice.getKey('MediaPause').code:
        rmp.pause();
        break;
      case tizen.tvinputdevice.getKey('MediaStop').code:
        rmp.stop();
        break;
      case tizen.tvinputdevice.getKey('ArrowLeft').code:
      case tizen.tvinputdevice.getKey('ArrowUp').code:
      case tizen.tvinputdevice.getKey('ArrowRight').code:
      case tizen.tvinputdevice.getKey('ArrowDown').code:
        _handleButtons(keyCode);
        break;
      case tizen.tvinputdevice.getKey('Enter').code:
        _triggerButton();
        break;
      case tizen.tvinputdevice.getKey('MediaPlayPause').code:
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
  } else {
    // for web testing where tizen global var is not available
    switch (keyCode) {
      case 412: // MediaRewind 
        rmp.seekTo(currentTime - 10000);
        break;
      case 417: // MediaFastForward 
        rmp.seekTo(currentTime + 10000);
        break;
      case 10221: // Caption
      case 403: // ColorF0Red
        _handleCaptions();
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
  document.body.addEventListener('keydown', _onKeyDown);
});
