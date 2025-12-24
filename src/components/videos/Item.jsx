/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VIDEO_TYPES } from '../../config/app.config';
import convertSecToTime from '../../utils/timeformat.util';
import lockImage from '../../assets/images/lock_image.png';
import subPrompt from '../../layout/subPrompt.layout';
import NavigateBack from '../common/navigate-back.component';
import useLazyLoad from '../../hooks/useLazyLoad';
// import scrollAppView from '../../utils/viewScroll.util';

const Item = ({
  id,
  videoId,
  title,
  description,
  shortDescription,
  hlsUrl,
  isLive,
  poster,
  posterH,
  posterV,
  startTime,
  endTime,
  duration,
  progress,
  genres,
  category,
  channelId,
  director,
  actor1,
  actor2,
  actor3,
  rating,
  ratingSource,
  season,
  episode,
  srtUrl,
  vttUrl,
  source,
  playDirectUrl,
  liveVastUrl,
  type,
  isExclusiveContent,
  dataFocusLeft,
  dataFocusRight,
  dataFocusUp,
  dataFocusDown,
  dataOnSelfFocus,
  handleShowDetailPage,

  dataOnPagination,
  handleScroll,
  index,
  focusIn,
  containerId,
  myArrayData,
  vType,
  episods,
  handleOpenSeries,
  episodes,
  activeSubPage,
  vastUrlRoku,
  handleLock,
  trailerUrl,
  perPageRows,
  // appendCatData,
  activeRow,
  // showData,
  // drawCanvas,
  seriesContent = [],
  searchType = false,
}) => {
  if (searchType && vType === 'series' && !seriesContent?.episodes) {
    return null;
  }
  const [ref, isVisible] = useLazyLoad({
    rootMargin: '200px',
    threshold: 0.01,
  });
  const getBtnPress = window.localStorage.getItem('btn-press');
  const getIdLock = window.localStorage.getItem('LockId');

  const [imageLoaded, setImageLoaded] = useState(false);
  const showProgress = Math.ceil((progress * 100) / duration);
  const thumbLoaded = useRef(false);

  const isPortrait = type === VIDEO_TYPES.MOVIES;
  const handleFocusIn = () => {
    if (!id.includes('grid')) {
      handleScroll();
    }
  };

  const handleFocusOut = () => {
    handleScroll();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (thumbLoaded.current) return;
    thumbLoaded.current = true;
  }, []);

  const mouseHover = (hoverId) => {
    Array.from(document.querySelectorAll('.prj-element.focused')).forEach(
      (el) => {
        el.classList.remove('focused');
      }
    );

    window.document.getElementById(hoverId).classList.add('focused');
    // eslint-disable-next-line no-unused-vars
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );

    // handleFocusIn();
  };

  return (
    <>
      {/* <div
      // id={`${id}-row-scroll`}
      > */}

      <div
        ref={ref}
        id={id}
        className={`media-element ${videoId} ${index === 0 ? 'active-list' : ''} ${
          isPortrait ? 'portrait' : 'landscape'
        } prj-element ${containerId} ${vType}-vType`}
        data-focus-left={dataFocusLeft || false}
        data-focus-right={dataFocusRight || false}
        data-focus-up={dataFocusUp || false}
        data-focus-down={dataFocusDown || false}
        data-focus-pagination={dataOnPagination}
        data-focus-in={focusIn}
        data-on-self-focus={dataOnSelfFocus || false}
        // data-focus-out={`${id}-focus-out`}
        onClick={() => {
          vType === 'series'
            ? handleOpenSeries({
                title,
                id: videoId,
                activeSubPage,
                vastRoku: vastUrlRoku,
                seriesContent,
              })
            : handleShowDetailPage({
                id: videoId,
                title,
                description,
                poster,
                posterH,
                posterV,
                hlsUrl,
                isLive,
                genres,
                duration,
                category,
                channelId,
                director,
                actor1,
                actor2,
                actor3,
                rating,
                ratingSource,
                season,
                episode,
                srtUrl,
                vttUrl,
                source,
                playDirectUrl,
                liveVastUrl,
                isPortrait,
                vastRoku: vastUrlRoku,
                isExclusiveContent,
                trailerUrl,
              });
        }}
        onMouseEnter={() => mouseHover(id)}
        role="none"
      >
        <div className="img">
          {/* <div className="img-container">
            <img
              src={isPortrait ? posterV : posterH}
              alt={title}
              loading="lazy"
            />
          </div> */}
          <div className="img-container">
            {isVisible && (
              <img
                src={isPortrait ? posterV : posterH}
                alt={`${id}-thumb-${videoId}`}
                id={`${id}-thumb-${videoId}`}
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

            <div className="video-progress">
              <div className={`progress progress-${videoId} hide`}>
                <div
                  className={`progress-bar progress-bar-${videoId}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          {!isPortrait && vType !== 'series' && !isLive && (
            <div className="video-duration">{convertSecToTime(duration)}</div>
          )}
          {!isPortrait && duration > 0 && progress > 0 && (
            <div className="progress-wrapper">
              <div className="progress-bar">
                <span
                  className="progress-bar-fill"
                  style={{ width: `${showProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {type !== VIDEO_TYPES.MOVIES && <p className="title">{title}</p>}
        {type === VIDEO_TYPES.VIDEO && (
          <p className="sub-title">{description}</p>
        )}
      </div>
      {/* </div> */}
      <button
        className="hide"
        type="button"
        id={`${id}-focus-in`}
        onClick={handleFocusIn}
      >
        Focus In
      </button>
      <button
        className="hide"
        type="button"
        id={`${id}-focus-out`}
        onClick={handleFocusOut}
      >
        Focus Out
      </button>
      {/* {showSeries && (
        <div className="fullscreen-series-container-fixed">
          new series component
        </div>
        // <HorizontalList
        //   id={2}
        //   title="Movies"
        //   containerId="hl-2"
        //   // videosCount={videosData[smd.id].seriesCount}
        //   type="video"
        //   activePage=""
        //   activeSubPage=""
        //   //  videosList={data.movies}
        //   keyUpElement=".hl-1"
        //   keyDownElement=".hl-3"
        //   setActiveDetId={setActiveDetId}
        //   handleHideDetailPage={handleHideDetailPage}
        //   handleShowDetailPage={handleShowDetailPage}
        //   handleVideoData={handleVideoData}
        //   searchType
        //   focusOut="2-focus-out"
        // />
      )} */}
    </>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  videoId: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  hlsUrl: PropTypes.string.isRequired,
  isLive: PropTypes.bool.isRequired,
  poster: PropTypes.string.isRequired,
  posterH: PropTypes.string.isRequired,
  posterV: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  genres: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  channelId: PropTypes.number.isRequired,
  director: PropTypes.string.isRequired,
  actor1: PropTypes.string.isRequired,
  actor2: PropTypes.string.isRequired,
  actor3: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  ratingSource: PropTypes.string.isRequired,
  season: PropTypes.number.isRequired,
  episode: PropTypes.number.isRequired,
  srtUrl: PropTypes.string.isRequired,
  vttUrl: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  playDirectUrl: PropTypes.string.isRequired,
  liveVastUrl: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isExclusiveContent: PropTypes.bool.isRequired,
  dataFocusLeft: PropTypes.string.isRequired,
  dataFocusRight: PropTypes.string.isRequired,
  dataFocusUp: PropTypes.string.isRequired,
  dataFocusDown: PropTypes.string.isRequired,
  dataOnSelfFocus: PropTypes.string.isRequired,
  handleShowDetailPage: PropTypes.func.isRequired,
  dataOnPagination: PropTypes.string.isRequired,
  handleScroll: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  focusIn: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  myArrayData: PropTypes.array.isRequired,
  vType: PropTypes.string.isRequired,
  handleOpenSeries: PropTypes.func.isRequired,
  episods: PropTypes.array.isRequired,
  episodes: PropTypes.array.isRequired,
  activeSubPage: PropTypes.string.isRequired,
  vastUrlRoku: PropTypes.string.isRequired,
  handleLock: PropTypes.func.isRequired,
  trailerUrl: PropTypes.string.isRequired,
  perPageRows: PropTypes.number.isRequired,
  // appendCatData: PropTypes.func.isRequired,
  activeRow: PropTypes.number.isRequired,
  // drawCanvas: PropTypes.func.isRequired,
  // showData: PropTypes.func.isRequired,
  seriesContent: PropTypes.array.isRequired,
  searchType: PropTypes.bool.isRequired,
};

export default Item;
