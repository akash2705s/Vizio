import React from 'react';
import PropTypes from 'prop-types';

const NavigateBack = ({ onBack }) => (
  <button type="button" className="app-back-handler hide" onClick={onBack}>
    Back
  </button>
);

NavigateBack.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default NavigateBack;
