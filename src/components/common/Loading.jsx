import React from 'react';
import PropTypes from 'prop-types';
import CircularLoader from './CircularLoader';

const Loading = ({
  showVideo,
  page,
  size = 120,
  showText = false,
  text = 'Loading...',
}) => (
  <div className={showVideo ? 'loader loader-fix-pos' : 'loader'} id={page}>
    <CircularLoader
      size={size}
      showText={showText}
      text={text}
      className="loading-circular"
    />
  </div>
);

Loading.propTypes = {
  showVideo: PropTypes.bool,
  page: PropTypes.string,
  size: PropTypes.number,
  showText: PropTypes.bool,
  text: PropTypes.string,
};
Loading.defaultProps = {
  showVideo: false,
  page: '',
  size: 120,
  showText: false,
  text: 'Loading...',
};

export default Loading;
