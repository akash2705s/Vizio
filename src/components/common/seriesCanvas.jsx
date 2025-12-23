import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useLazyLoad from '../../hooks/useLazyLoad';
import playIcon from '../../assets/images/play_icon.png';

const SeriesCanvas = ({ seriesCanvasId, seriesImage }) => {
  // const thumbLoaded = useRef(false);
  const [ref, isVisible] = useLazyLoad({
    rootMargin: '200px',
    threshold: 0.01,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div ref={ref}>
      {isVisible && (
        <img
          src={seriesImage}
          alt={`${seriesCanvasId}-thumb-${seriesCanvasId}`}
          id={`${seriesCanvasId}-thumb-${seriesCanvasId}`}
          width={560}
          height={315}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      <img src={playIcon} alt="play" className="series-play-icon" />
    </div>
  );
};

SeriesCanvas.propTypes = {
  seriesCanvasId: PropTypes.string.isRequired,
  seriesImage: PropTypes.string.isRequired,
};

export default SeriesCanvas;
