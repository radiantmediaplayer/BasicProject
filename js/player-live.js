const playerButtons = [
  { id: 0, name: 'playPause', element: null }
];

const container = document.querySelector('.rmp-container');
let currentActiveButtonId, isPaused;

const _createEvent = (eventName, element) => {
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
const _removeHoverClass = () => {
  for (let i = 0, len = playerButtons.length; i < len; i++) {
    playerButtons[i].element.classList.remove('rmp-button-hover');
  }
};

const _setActiveButton = (id) => {
  currentActiveButtonId = id;
  playerButtons[id].element.classList.add('rmp-button-hover');
};

const _handleButtons = (keyCode) => {
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

const _triggerButton = () => {
  const currentActiveButton = container.querySelector('.rmp-button-hover');
  _createEvent('click', currentActiveButton);
};

// when TV remote buttons are pressed do something
const _onKeyDown = (e) => {
  const keyCode = e.keyCode;
  window.console.log('Key code called : ' + keyCode);
  window.rmp.controlsVisible = true;
  switch (keyCode) {
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
const _registerKey = () => {
  try {
    const value = tizen.tvinputdevice.getSupportedKeys();
    window.console.log(value);
    tizen.tvinputdevice.registerKeyBatch([
      'MediaPlayPause',
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
  _registerKey();
  document.body.addEventListener('keydown', _onKeyDown);
  _setActiveButton(0);
});
