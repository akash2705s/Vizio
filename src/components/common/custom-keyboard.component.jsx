import React, { useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardDelete from '../../assets/keyboard/keyboard-delete.png';
import KeyboardSpace from '../../assets/keyboard/keyboard-space.png';
import KeyboardBackspace from '../../assets/keyboard/keyboard-backspace.png';
import { CUSTOM_KEYBOARD_KEYS } from '../../utils/helper.util';
import voiceSpeak from '../../utils/accessibility.util';

const CustomKeyboard = ({
  title,
  callbackInput,
  customUpKeyEvent,
  customLeftKeyEvent,
  customRightKeyEvent,
  isFocused,
  inputVal,
}) => {
  const [inputText, setInputText] = useState(inputVal || '');

  const handleFocusIn = (key) => {
    voiceSpeak(key);
    if (key === 'custom-keyboard-textbox') {
      const qwertyInput = document.getElementById('vizio-qwerty-input');
      if (qwertyInput) {
        setTimeout(() => {
          qwertyInput.focus();
        }, 0);
      }
    }
  };

  const handleClick = (key) => {
    let input = inputText;
    if (
      key !== 'delete' &&
      key !== 'space' &&
      key !== 'backspace' &&
      key !== 'custom-keyboard-textbox' &&
      input.length < 15
    ) {
      input += key;
    } else if (key === 'delete') {
      input = '';
    } else if (key === 'space') {
      input += ' ';
    } else if (key === 'backspace' && input.length > 0) {
      input = input.slice(0, -1);
    }
    setInputText(input);
    callbackInput(input);

    const qwertyInput = document.getElementById('vizio-qwerty-input');
    if (qwertyInput) {
      qwertyInput.value = input;
    }
  };

  const handleCustomDownFocusEvent = (col) => {
    let focusKey = '';
    if (col === 0 || col === 1) {
      focusKey = 'delete';
    } else if (col === 2 || col === 3) {
      focusKey = 'space';
    } else if (col === 4 || col === 5) {
      focusKey = 'backspace';
    }

    return focusKey;
  };

  return (
    <div className="custom-keyboard-container">
      {title && <div className="custom-keyboard-title">{title}</div>}
      <input
        id="vizio-qwerty-input"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        spellCheck={false}
        value={inputText}
        onChange={(e) => {
          const value = e.target.value.slice(0, 15); // respect your length limit
          setInputText(value);
          callbackInput(value);
        }}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
        }}
      />
      <div
        className="custom-keyboard-textbox prj-element"
        id="custom-keyboard-textbox"
        data-focus-down="#ck-0-0"
        data-focus-in="#custom-keyboard-textbox-focus-in"
        data-focus-up={customUpKeyEvent || '#custom-keyboard-textbox'}
        onClick={() => handleClick('custom-keyboard-textbox')}
        role="none"
      >
        {inputText !== '' ? inputText : 'Search Videos, Movies, Events'}
      </div>

      <button
        className="hide"
        type="button"
        id="custom-keyboard-textbox-focus-in"
        onClick={() => handleFocusIn("custom-keyboard-textbox")}
      >
        Focus In
      </button>

      <div
        className="custom-keyboard-key-container"
        id="custom-keyboard-key-container"
      >
        {CUSTOM_KEYBOARD_KEYS.map((keyboardRow, row) => (
          <div className="custom-keyboard-key-row" key={`ck-${row}`}>
            {keyboardRow.map((key, col) => (
              <React.Fragment key={`ck-${row}-${col}`}>
                <div
                  className={
                    col === 0 && row === 0
                      ? `custom-keyboard-key-col active-key prj-element ${isFocused}`
                      : `custom-keyboard-key-col prj-element`
                  }
                  id={`ck-${row}-${col}`}
                  data-focus-left={
                    col - 1 >= 0
                      ? `#ck-${row}-${col - 1}`
                      : customLeftKeyEvent || `#ck-${row}-${0}`
                  }
                  data-focus-right={
                    col + 1 <= keyboardRow.length - 1
                      ? `#ck-${row}-${col + 1}`
                      : customRightKeyEvent ||
                      `#ck-${row}-${keyboardRow.length - 1}`
                  }
                  data-focus-up={
                    row - 1 >= 0
                      ? `#ck-${row - 1}-${col}`
                      : '#custom-keyboard-textbox' || customUpKeyEvent
                  }
                  data-focus-down={`#ck-${row + 1 <= keyboardRow.length - 1
                    ? `${row + 1}-${col}`
                    : handleCustomDownFocusEvent(col)
                    }`}
                  data-focus-in={`#ck-${row}-${col}-focus-in`}
                  onClick={() => {
                    handleClick(key);
                  }}
                  role="none"
                >
                  {key}
                </div>
                <button
                  className="hide"
                  type="button"
                  id={`ck-${row}-${col}-focus-in`}
                  onClick={() => handleFocusIn(key)}
                >
                  Focus In
                </button>
              </React.Fragment>
            ))}
          </div>
        ))}

        <div
          className="custom-keyboard-key-row custom-keyboard-last-row"
          id="custom-keyboard-last-rows"
        >
          <div
            className="custom-keyboard-key-col-2 prj-element"
            id="ck-delete"
            data-focus-left={customLeftKeyEvent || '#ck-delete'}
            data-focus-right="#ck-space"
            data-focus-up={`#ck-${CUSTOM_KEYBOARD_KEYS.length - 1}-${0}`}
            data-focus-down={false}
            data-focus-in="#ck-delete-focus-in"
            onClick={() => {
              handleClick('delete');
            }}
            role="none"
          >
            <img
              src={KeyboardDelete}
              alt=""
              className="custom-keyboard-button-image"
            />
          </div>
          <button
            className="hide"
            type="button"
            id="ck-delete-focus-in"
            onClick={() => handleFocusIn('delete')}
          >
            Focus In
          </button>
          <div
            className="custom-keyboard-key-col-2 prj-element"
            id="ck-space"
            data-focus-left="#ck-delete"
            data-focus-right="#ck-backspace"
            data-focus-up={`#ck-${CUSTOM_KEYBOARD_KEYS.length - 1}-${2}`}
            data-focus-down={false}
            data-focus-in="#ck-space-focus-in"
            onClick={() => {
              handleClick('space');
            }}
            role="none"
          >
            <img
              src={KeyboardSpace}
              alt=""
              className="custom-keyboard-button-image"
            />
          </div>
          <button
            className="hide"
            type="button"
            id="ck-space-focus-in"
            onClick={() => handleFocusIn('space')}
          >
            Focus In
          </button>
          <div
            className="custom-keyboard-key-col-2 prj-element"
            id="ck-backspace"
            data-focus-left="#ck-space"
            data-focus-right={customRightKeyEvent || '#ck-backspace'}
            data-focus-up={`#ck-${CUSTOM_KEYBOARD_KEYS.length - 1}-${4}`}
            data-focus-down={false}
            data-focus-in="#ck-backspace-focus-in"
            onClick={() => {
              handleClick('backspace');
            }}
            role="none"
          >
            <img
              src={KeyboardBackspace}
              alt=""
              className="custom-keyboard-button-image"
            />
          </div>
          <button
            className="hide"
            type="button"
            id="ck-backspace-focus-in"
            onClick={() => handleFocusIn('backspace')}
          >
            Focus In
          </button>
        </div>
      </div>
    </div>
  );
};

CustomKeyboard.propTypes = {
  title: PropTypes.string,
  callbackInput: PropTypes.func.isRequired,
  customUpKeyEvent: PropTypes.string,
  customLeftKeyEvent: PropTypes.string,
  customRightKeyEvent: PropTypes.string,
  isFocused: PropTypes.string,
  inputVal: PropTypes.string,
};

CustomKeyboard.defaultProps = {
  title: '',
  customUpKeyEvent: '',
  customLeftKeyEvent: '',
  customRightKeyEvent: '',
  isFocused: '',
  inputVal: '',
};

export default CustomKeyboard;
