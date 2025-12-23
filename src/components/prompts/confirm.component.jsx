import React from 'react';
import PropTypes from 'prop-types';
import PromptLayout from '../../layout/prompt.layout';

const ConfirmPrompt = ({
  title,
  description,
  confirmBtnText,
  cancelBtnText,
  onConfirm,
  onCancel,
}) => (
  <div className="confirm-prompt">
    <PromptLayout>
      <div className="dialog view popup user-active" id="confirm-prompt">
        <div className="dialog-body">
          {title !== '' && <div className="title">{title}</div>}

          <div className="desciption">{description}</div>
          <div className="actions">
            <button
              type="button"
              className="btn confirm left prj-element focused"
              onClick={onConfirm}
              id="confirm-btn"
              data-focus-right="#cancel-btn"
            >
              {confirmBtnText}
            </button>
            <button
              type="button"
              className="btn cancel prj-element"
              onClick={onCancel}
              id="cancel-btn"
              data-focus-left="#confirm-btn"
            >
              {cancelBtnText}
            </button>
          </div>
        </div>
      </div>
    </PromptLayout>
  </div>
);

ConfirmPrompt.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  confirmBtnText: PropTypes.string.isRequired,
  cancelBtnText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
ConfirmPrompt.defaultProps = {
  title: '',
};

export default ConfirmPrompt;
