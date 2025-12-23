import React from 'react';
import PropTypes from 'prop-types';
import './CircularLoader.css';

const CircularLoader = ({
  size = 120,
  color = 'var(--theme-color-primary)',
  thickness = 3,
  speed = 1,
  showText = false,
  text = 'Loading...',
  className = '',
  variant = 'default', // 'default', 'pulse', 'bounce', 'fade'
  direction = 'clockwise', // 'clockwise', 'counterclockwise'
}) => {
  const strokeDasharray = 2 * Math.PI * (size / 2 - thickness);
  const strokeDashoffset = strokeDasharray * 0.25;

  const getVariantClass = () => {
    switch (variant) {
      case 'pulse':
        return 'circular-loader-pulse';
      case 'bounce':
        return 'circular-loader-bounce';
      case 'fade':
        return 'circular-loader-fade';
      default:
        return '';
    }
  };

  const getDirectionClass = () =>
    direction === 'counterclockwise' ? 'circular-loader-counterclockwise' : '';

  return (
    <div
      className={`circular-loader-container ${className} ${getVariantClass()}`}
    >
      <div className="circular-loader-wrapper">
        <svg
          className="circular-loader"
          width={size}
          height={size}
          style={{
            '--loader-color': color,
            '--loader-speed': `${speed}s`,
          }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - thickness}
            fill="none"
            stroke="rgba(0, 123, 255, 0.1)"
            strokeWidth={thickness}
          />
          {/* Animated circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - thickness}
            fill="none"
            stroke="var(--loader-color)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`circular-loader-path ${getDirectionClass()}`}
          />
        </svg>
        {showText && <div className="circular-loader-text">{text}</div>}
      </div>
    </div>
  );
};

CircularLoader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  thickness: PropTypes.number,
  speed: PropTypes.number,
  showText: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'pulse', 'bounce', 'fade']),
  direction: PropTypes.oneOf(['clockwise', 'counterclockwise']),
};

CircularLoader.defaultProps = {
  size: 40,
  color: 'var(--theme-color-primary)',
  thickness: 3,
  speed: 1,
  showText: false,
  text: 'Loading...',
  className: '',
  variant: 'default',
  direction: 'clockwise',
};

export default CircularLoader;
