/* eslint-disable no-lonely-if */
import { getBrowserVersion } from './helper.util';
import isWeb from './platforms.util';

// Utility to handle focus
const addRemoveFocus = (previousElement, nextElement) => {
  if (previousElement) {
    previousElement.classList.remove('focused');
    if (
      ['text', 'password', 'email', 'query'].includes(
        previousElement?.type || ''
      )
    ) {
      previousElement.blur();
    }
  }
  if (nextElement) {
    if (
      nextElement.classList.contains('video-item') &&
      !nextElement.classList.contains('active-list')
    ) {
      previousElement.classList.remove('active-list');
      nextElement.classList.add('active-list');
    }
    if (
      (nextElement.classList.contains('custom-keyboard-key-col') ||
        nextElement.classList.contains('custom-keyboard-key-col-2')) &&
      !nextElement.classList.contains('active-key')
    ) {
      previousElement.classList.remove('active-key');
      nextElement.classList.add('active-key');
    }
    nextElement.classList.add('focused');
    if (
      ['text', 'password', 'email'].includes(nextElement?.type || '') &&
      isWeb()
    ) {
      nextElement.focus();
    }
  }
};
const handleTraverseKey = (key) => {
  let nextElement = null;
  let element = window.document.querySelector(
    '.user-active.popup .prj-element.focused'
  );
  if (!element) {
    element = window.document.querySelector(
      '.user-active.view .prj-element.focused'
    );
  }
  if (
    key === 'focusRight' &&
    ['text', 'password', 'email'].includes(element?.type || '')
  ) {
    if (element.id === window.document.activeElement.id) {
      return;
    }
  }
  if (!element) return;
  if (element.classList.contains('player-progress-track')) {
    if (key === 'focusRight') {
      window.document.getElementById('fast-forward').click();
    }
    if (key === 'focusLeft') {
      window.document.getElementById('rewind').click();
    }
  }
  const elementFocusDef = element.dataset;
  if (elementFocusDef[key]) {
    nextElement = window.document.querySelector(elementFocusDef[key]);
    if (nextElement) {
      addRemoveFocus(element, nextElement);
    }
  }
  // Manage on focus out handle
  if (elementFocusDef.focusOut) {
    const focusOutElement = window.document.querySelector(
      elementFocusDef.focusOut
    );
    if (focusOutElement) {
      focusOutElement.click();
    }
  }
  if (elementFocusDef.focusSearchOut) {
    const focusOutElement = window.document.querySelector(
      elementFocusDef.focusSearchOut
    );
    if (focusOutElement) {
      focusOutElement.click();
    }
  }
  // Manage on focus in handle
  if (nextElement) {
    const nextElementFocusDef = nextElement.dataset;
    if (nextElementFocusDef.focusIn) {
      const focusInElement = window.document.querySelector(
        nextElementFocusDef.focusIn
      );
      if (focusInElement) {
        focusInElement.click();
      }
    }

    // Handle scroll
    if (
      nextElementFocusDef?.onSelfFocus &&
      nextElementFocusDef?.onSelfFocus !== 'false'
    ) {
      const selfFocusElement = window.document.querySelector(
        nextElementFocusDef.onSelfFocus
      );
      if (selfFocusElement) {
        selfFocusElement.click();
      }
    }
  }
};
const handleEnterKey = () => {
  let element = window.document.querySelector(
    '.user-active.popup .prj-element.focused'
  );
  if (!element) {
    element = window.document.querySelector(
      '.user-active.view .prj-element.focused'
    );
  }
  if (!element) return;
  if (element.classList.contains('player-progress-track')) {
    window.document.getElementById('play-pause').click();
  }
  element.click();
  if (['text', 'password', 'email'].includes(element?.type || '')) {
    if (element.id === window.document.activeElement.id) {
      element.blur();
    } else {
      element.focus();
    }
  }
};
const handleBackKey = () => {
  const element = window.document.querySelector(
    '.user-active.view .prj-element.focused'
  );
  if (['text', 'password', 'email'].includes(element?.type || '')) {
    if (element.id === window.document.activeElement.id) {
      element.blur();
    }
  }
  let backElement = window.document.querySelector(
    '.video-player-container.view .app-back-handler'
  );
  if (!backElement) {
    backElement = window.document.querySelector('.user-active.popup .cancel');
    if (!backElement) {
      backElement = window.document.querySelector(
        '.user-active.view .app-back-handler'
      );
    }
  }
  if (backElement) {
    backElement.click();
  }
};
// window.document.addEventListener('wheel', (e) => {
//   const deltaY = Math.sign(e.deltaY);
//   if (deltaY === 1) {
//     handleTraverseKey('focusDown');
//   } else if (deltaY === -1) {
//     handleTraverseKey('focusUp');
//   }
// });
// window.document.addEventListener('mouseover', (e) => {
//   if (e?.target?.classList?.contains('prj-element')) {
//     if (
//       window.document
//         .querySelector('.user-active')
//         .classList.contains('view-container')
//     ) {
//       if (e.target.classList.contains('video-item')) {
//         window?.document
//           ?.querySelector('.user-active #home-featured-container')
//           ?.classList?.add('not-active');
//         window?.document
//           ?.querySelector('.home-preview-title')
//           ?.classList?.remove('hide');
//         window?.document?.querySelector(`#${e.target.id}-focus-in`)?.click();
//       } else {
//         window?.document
//           ?.querySelector('.user-active #home-featured-container')
//           ?.classList?.remove('not-active');
//         window?.document
//           ?.querySelector('.home-preview-title')
//           ?.classList?.add('hide');
//       }
//     }
//     if (e.target.closest('.top-navigation .prj-element.link')) {
//       if (
//         e.target.dataset?.onSelfFocus &&
//         e.target.dataset?.onSelfFocus !== 'false'
//       ) {
//         const focusHandleElements = window.document.querySelector(
//           e.target.dataset.onSelfFocus
//         );
//         if (focusHandleElements) {
//           focusHandleElements.click();
//         }
//       }
//     }
//     if (
//       e.target.closest('#details-view-info') ||
//       e.target.closest('#details-view-back')
//     ) {
//       if (
//         !window.document
//           .querySelector('#details-view-info')
//           .classList?.contains('active')
//       ) {
//         window.document
//           .querySelector('#details-view-info')
//           .classList?.remove('not-active');
//         if (
//           window.document
//             .getElementById('list-similar')
//             .classList.contains('active')
//         ) {
//           window.document
//             .getElementById('list-similar')
//             .classList.remove('active');
//           window.document.getElementById('hide-similar').click();
//         }
//         if (
//           window.document
//             ?.getElementById('list-episodes')
//             ?.classList?.contains('active')
//         ) {
//           window?.document
//             ?.getElementById('list-episodes')
//             ?.classList?.remove('active');
//           window.document.getElementById('hide-similar').click();
//         }
//       }
//     }
//     if (e.target.id === 'list-episodes') {
//       window.document.getElementById('show-episodes').click();
//     }
//     if (e.target.id === 'list-similar') {
//       window.document.getElementById('show-similar').click();
//     }
//     window?.document
//       ?.querySelector('.user-active .prj-element.focused')
//       ?.classList?.remove('focused');
//     e?.target?.classList?.add('focused');
//   } else {
//     // for handling scroll in details page
//     if (e.target.closest('.tab-view')) {
//       if (
//         !window.document
//           .querySelector('.tab-view')
//           .classList?.contains('active')
//       ) {
//         if (window.document.getElementById('list-episodes')) {
//           window.document
//             .getElementById('list-episodes')
//             .classList.add('active');
//           window.document.getElementById('show-episodes').click();
//         } else {
//           window.document
//             .getElementById('list-similar')
//             .classList.add('active');
//           window.document.getElementById('show-similar').click();
//         }
//       } else {
//         if (e.target.classList.contains('episode')) {
//           window?.document?.querySelector(`#${e.target?.id}-focus-in`)?.click();
//           if (window.document.querySelector('.prj-element.focused')) {
//             window.document
//               .querySelector('.prj-element.focused')
//               .classList.remove('focused');
//           }
//           window.document
//             .querySelector(`#${e.target?.id} .prj-element`)
//             .classList.add('focused');
//         }
//       }
//     }
//     // for handling focus on items
//     if (e.target.closest('.prj-element')) {
//       window?.document
//         ?.querySelector('.user-active .prj-element.focused')
//         ?.classList?.remove('focused');
//       e.target.closest('.prj-element').classList.add('focused');
//       window?.document
//         ?.querySelector(
//           `#${e.target.closest('.prj-element.focused')?.id}-focus-in`
//         )
//         ?.click();
//     }
//   }
// });
let action = true;
let intervalId = null;

function handleKeyPress(eventKeyCode, event) {
  // console.log('eventKeyCode:', eventKeyCode, ' event:', event);

  switch (eventKeyCode) {
    case 'ArrowDown' || 40:
    case 40:
      event.preventDefault();
      if (!window.document.getElementById('home-page-loader')) {
        if (window.document.querySelector('.user-active #focus-down-btn')) {
          window.document.querySelector('.user-active #focus-down-btn').click();
        }
        handleTraverseKey('focusDown');
      }

      break;
    case 'ArrowUp':
    case 38:
      event.preventDefault();
      if (window.document.querySelector('.user-active #focus-up-btn')) {
        window.document.querySelector('.user-active #focus-up-btn').click();
      }
      handleTraverseKey('focusUp');
      break;
    case 'ArrowLeft':
    case 37:
      handleTraverseKey('focusLeft');
      break;
    case 'ArrowRight':
    case 39:
      handleTraverseKey('focusRight');
      break;
    case 'Enter':
    case 'NumpadEnter':
    case 13:
      event.preventDefault();
      if (
        window.document.querySelectorAll('.bmp-ad-play') &&
        window.document.querySelectorAll('.bmp-ad-play').length > 0
      ) {
        window.document.querySelectorAll('.bmp-ad-play')[0].click();
      }
      handleEnterKey();
      break;
    case 'Backspace': {
      const textBox = document.querySelector('.custom-keyboard-textbox.prj-element.focused');
      const hasDefaultText = textBox &&
        (textBox.textContent === 'Search Videos, Movies, Events' ||
          textBox.textContent.trim() === '');

      if (!textBox || hasDefaultText) {
        event.preventDefault();
        handleBackKey();
      }
      break;
    }
    case 'Escape':
    case 461:
      if (isWeb()) {
        event.preventDefault();
        handleBackKey();
      }
      break;
    case 10252:
    case 'MediaPlayPause':
      event.preventDefault();
      if (
        window.document.querySelectorAll('.bmp-ad-play') &&
        window.document.querySelectorAll('.bmp-ad-play').length > 0
      ) {
        window.document.querySelectorAll('.bmp-ad-play')[0].click();
      }
      break;
    case 415:
    case 'MediaPlay':
    case 'Play':
      // case 'Digit1':
      event.preventDefault();
      break;
    case 19:
    case 'MediaPause':
    case 'Pause':
      event.preventDefault();
      break;
    case 'MediaFastForward':
    case 417:
      event.preventDefault();
      break;
    case 'MediaRewind':
    case 412:
      event.preventDefault();
      break;
    case 'MediaStop':
    case 413:
      event.preventDefault();
      if (window.document.getElementById('PLAYER_DOM_ID')) {
        handleBackKey();
      }
      break;
    default:
      break;
  }
}

window.document.addEventListener(
  'keydown',
  (event) => {
    if (
      window.document
        .querySelector('.user-active')
        .classList.contains('video-container')
    ) {
      window.document.getElementById('show-controlbar').click();
    }
    const eventKeyCode = event.code || event.keyCode;
    // console.log('event.code:', event.code, 'event.keyCode:', event.keyCode);

    if (
      action &&
      ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(eventKeyCode)
    ) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      action = false;
      handleKeyPress(eventKeyCode, event);
      intervalId = setInterval(() => {
        handleKeyPress(eventKeyCode, event);
      }, 700);
    } else if (
      !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(
        event.code || event.keyCode
      )
    ) {
      handleKeyPress(eventKeyCode, event);
    }
  },
  false
);

window.document.addEventListener('keyup', (event) => {
  action = true;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (
    (event.keyCode === 461 || event.key === 'RCUBack') &&
    getBrowserVersion() >= 120
  ) {
    handleBackKey();
  }
});
