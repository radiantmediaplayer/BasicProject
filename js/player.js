const playerButtons = [
  { id: 0, name: 'playPause', element: null },
  { id: 1, name: 'fastRewind', element: null },
  { id: 2, name: 'quickRewind', element: null },
  { id: 3, name: 'quickForward', element: null },
  { id: 4, name: 'fastForward', element: null }
];

let currentActiveButtonId, isPaused;

let container = document.querySelector('.rmp-container');

const _createEvent = function (eventName, element) {
  let event;
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
const _removeHoverClass = function () {
  for (let i = 0, len = playerButtons.length; i < len; i++) {
    playerButtons[i].element.classList.remove('rmp-button-hover');
  }
};

const _setActiveButton = function (id) {
  currentActiveButtonId = id;
  playerButtons[id].element.classList.add('rmp-button-hover');
  window.rmp.controlsVisible = true;
};

const _handleButtons = function (keyCode) {
  _removeHoverClass();
  let newId;
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

const _triggerButton = function () {
  let currentActiveButton = container.querySelector('.rmp-button-hover');
  _createEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
// we deal with 2 kind of remote: Basic Device, Smart Control 2016

const _onKeyDown = function (e) {
  const currentTime = window.rmp.currentTime;
  const keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  window.rmp.controlsVisible = true;
  switch (keyCode) {
    case 412: // MediaRewind
      window.rmp.seekTo(currentTime - 10000).then(() => {
        console.log('seekTo was successful');
      }).catch(warning => {
        // something went wrong and the seekTo request was not successful
        console.warn(warning);
      });
      break;
    case 417: // MediaFastForward
      window.rmp.seekTo(currentTime + 10000).then(() => {
        console.log('seekTo was successful');
      }).catch(warning => {
        // something went wrong and the seekTo request was not successful
        console.warn(warning);
      });
      break;
    case 10009: // Back
      window.location.replace('index.html');
      break;
    case 415: // MediaPlay
      window.rmp.play().then(() => {
        console.log('play was successful');
      }).catch(warning => {
        // something went wrong and the play request was not successful
        console.warn(warning);
      });
      break;
    case 19: // MediaPause
      window.rmp.pause();
      break;
    case 413: // MediaStop
      window.rmp.stop().then(() => {
        console.log('stop was successful');
      }).catch(warning => {
        // something went wrong and the stop request was not successful
        console.warn(warning);
      });
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
      isPaused = window.rmp.paused;
      if (isPaused) {
        window.rmp.play().then(() => {
          console.log('play was successful');
        }).catch(warning => {
          // something went wrong and the play request was not successful
          console.warn(warning);
        });
      } else {
        window.rmp.pause();
      }
      break;
    default:
      break;
  }
};

// register additional keys as per https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
const _registerKey = function () {
  try {
    let value = tizen.tvinputdevice.getSupportedKeys();
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

// when player reaches loadeddata we wire the UI
window.rmp.on('loadeddata', () => {
  playerButtons[0].element = container.querySelector('.rmp-play-pause');
  playerButtons[0].element.setAttribute('data-button-id', '0');

  playerButtons[1].element = container.querySelector('.rmp-fast-rewind');
  playerButtons[1].element.setAttribute('data-button-id', '1');

  playerButtons[2].element = container.querySelector('.rmp-i-quick-rewind-tv');
  playerButtons[2].element.setAttribute('data-button-id', '2');

  playerButtons[3].element = container.querySelector('.rmp-i-quick-forward-tv');
  playerButtons[3].element.setAttribute('data-button-id', '3');

  playerButtons[4].element = container.querySelector('.rmp-fast-forward');
  playerButtons[4].element.setAttribute('data-button-id', '4');

  _registerKey();
  document.body.addEventListener('keydown', _onKeyDown);
  _setActiveButton(0);
});
