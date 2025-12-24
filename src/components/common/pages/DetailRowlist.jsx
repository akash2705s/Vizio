import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useLazyLoad from '../../../hooks/useLazyLoad';

const DetailRowlist = ({ isPortrait, posterV, posterH, id }) => {
  const [ref, isVisible] = useLazyLoad({
    rootMargin: '200px',
    threshold: 0.01,
  });
  // const thumbLoaded = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  useEffect(() => {
    // if (thumbLoaded.current) return;
    // thumbLoaded.current = true;
    // const canvas = window.document.querySelector(`#${id}`);
    // if (canvas) {
    //   const ctx = canvas.getContext('2d');
    //   const verticalImg = posterV.split('?')[0];
    //   const horizontalImg = posterH.split('?')[0];
    //   const newImage = new Image();
    //   newImage.src = !isPortrait
    //     ? `${horizontalImg}?width=292&height=438&quality=30`
    //     : `${verticalImg}?width=560&height=315&quality=30`;
    //   newImage.onload = () => {
    //     ctx.imageSmoothingQuality = 'low';
    //     ctx.drawImage(
    //       newImage,
    //       0,
    //       0,
    //       isPortrait ? 292 : 560,
    //       isPortrait ? 438 : 315
    //     );
    //   };
    // }
  }, []);

  return (
    <div className="img" ref={ref}>
      <div className="img-container">
        {isVisible && (
          <img
            src={isPortrait ? posterV : posterH}
            alt={`${id}-thumb-${id}`}
            id={`${id}-thumb-${id}`}
            width={isPortrait ? 292 : 560}
            height={isPortrait ? 438 : 315}
            onLoad={handleImageLoad}
            loading="lazy"
            decoding="async"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}
      </div>
    </div>
  );
};

DetailRowlist.propTypes = {
  isPortrait: PropTypes.bool.isRequired,
  posterV: PropTypes.string.isRequired,
  posterH: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default DetailRowlist;
