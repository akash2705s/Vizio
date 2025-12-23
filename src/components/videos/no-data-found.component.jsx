import React from 'react';
import PropTypes from 'prop-types';

const NoDataFound = ({ message }) => (
  <div className="no-data-message-container">
    <div className="message">{message || 'No data available'}</div>
  </div>
);

NoDataFound.propTypes = {
  message: PropTypes.string,
};
NoDataFound.defaultProps = {
  message: '',
};

export default NoDataFound;
