/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import DetailLayout from '../../../layout/detail.layout';
// import Player from '../../common/Player';
import { getUserVideoProgress } from '../../../utils/local-cache.util';
import convertSecToTime from '../../../utils/timeformat.util';
import NavigateBack from '../navigate-back.component';
import handleRowListScroll from '../../../utils/rowlist-scroll.utils';
import playIcon from '../../../assets/images/icons/play.png';
import resumeIcon from '../../../assets/images/icons/resume.png';
import DetailRowlist from './DetailRowlist';
import useLazyLoad from '../../../hooks/useLazyLoad';
import { logger } from '../../../utils/helper.util';
import Player from '../Player';
import { VIDEO_TYPES } from '../../../config/app.config';
import voiceSpeak from '../../../utils/accessibility.util';
// import restoreFocus from '../../../utils/restoreFocus';
// import scrollAppView from '../../utils/viewScroll.util';

// const Player = lazy(() => import('../Player'));

const DetailPage = ({
  detailPageData,
  handleHideDetailPage,
  videos,
  containerIdPrefix,
  setShowDetailPage,
  handleBack,
  openFrom,
}) => {
  // let detailUpdatedData = detailPageData;
  const playFromBeginningTitle = "Play from beginning";
  const playTitle = "Play";
  const [detailUpdatedData, setDetailUpdatedData] = useState(detailPageData);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showPlayerFromProgress, setShowPlayerFromProgress] = useState(false);
  const scrollHandleButtonId = `scroll-element-${containerIdPrefix}`;
  const [moreLikeThis, setMoreLikeThis] = useState(
    videos.filter((a) => a.title !== detailPageData.title)
  );
  const [ref, isVisible] = useLazyLoad({
    rootMargin: '200px',
    threshold: 0.01,
  });

  // const [portrait, setPortrait] = useState(detailPageData.isPortrait);
  // const [posterH, setPosterH] = useState(detailPageData.posterH);
  // const [posterV, setPosterV] = useState(detailPageData.posterV);

  const renderThumbnailImage = (thumbImg, type) => {
    const detailImgPreview =
      type === 'overlay'
        ? window.document.querySelector('.bg-poster canvas')
        : window.document.querySelector('.image-wrap canvas');

    // const detailImage=window.document.querySelector('.image-wrap canvas')
    if (detailImgPreview) {
      const ctx = detailImgPreview.getContext('2d');

      const newImage = new Image();
      newImage.src = `${thumbImg}`;
      newImage.onload = () => {
        ctx.clearRect(
          0,
          0,
          type === 'overlay' ? 1920 : 864,
          type === 'overlay' ? 1080 : 486
        );
        ctx.imageSmoothingQuality = 'low';
        ctx.drawImage(
          newImage,
          0,
          0,
          type === 'overlay' ? 1920 : 864,
          type === 'overlay' ? 1080 : 486
        );
      };
    }
  };
  useEffect(() => {
    try {
      if (window.document.getElementById('bg-video-player')) {
        videojs('bg-player').pause();
      }
    } catch (e) {
      // do nothing
      logger.warn(e, 'error');
    }
    // const canvas = window.document.querySelector(
    //   `#details-portrait-${detailPageData.id}`
    // );
    // if (canvas) {
    //   const ctx = canvas.getContext('2d');
    //   const verticalImg =
    //     detailPageData.posterV ||
    //     detailPageData.poster_9_16_small ||
    //     detailPageData.poster_9_16;
    //   const horizontalImg =
    //     detailPageData.posterH ||
    //     detailPageData.poster_16_9_small ||
    //     detailPageData.poster_16_9;

    //   const newImage = new Image();
    //   newImage.src = '';
    //   newImage.src = !detailPageData.isPortrait
    //     ? `${horizontalImg}?width=400&height=600&quality=30`
    //     : `${verticalImg}?width=560&height=315&quality=30`;
    //   newImage.onload = () => {
    //     ctx.clearRect(
    //       0,
    //       0,
    //       !detailPageData.isPortrait ? 400 : 560,
    //       !detailPageData.isPortrait ? 600 : 315
    //     );
    //     ctx.imageSmoothingQuality = 'low';
    //     ctx.drawImage(
    //       newImage,
    //       0,
    //       0,
    //       detailPageData.isPortrait ? 400 : 560,
    //       detailPageData.isPortrait ? 600 : 315
    //     );
    //   };
    // }
  }, []);

  useEffect(() => {
    renderThumbnailImage(detailPageData.posterH, 'overlay');
    renderThumbnailImage(detailPageData.posterH, 'thumb');
    const myProgress = getUserVideoProgress(detailUpdatedData.id);
    if (myProgress > 0) {
      setCurrentProgress(Math.ceil(Number(myProgress)));
    } else {
      setCurrentProgress(0);
    }
    setShowButtons(true);
  }, [detailUpdatedData.id]);

  const handlePlayerOpen = (fromProgress, typeVideo = true) => {
    if (typeVideo) {
      setShowPlayerFromProgress(fromProgress);
      setIsTrailer(false);
    } else {
      setIsTrailer(true);
    }
    setShowPlayer(true);
  };
  const handlePlayerClose = () => {
    setShowPlayer(false);

    const myProgress = getUserVideoProgress(detailUpdatedData.id);
    if (myProgress > 0 && !isTrailer) {
      setCurrentProgress(Math.ceil(Number(myProgress)));
    } else {
      // setCurrentProgress(0);
      if (window.document.getElementById('trailer-btn')) {
        window.document.getElementById('resume-from').classList.add('focused');
      }
      if (window.document.getElementById('resume-from')) {
        window.document
          .getElementById('resume-from')
          .classList.remove('focused');
      }
      if (window.document.getElementById('play-btn')) {
        window.document.getElementById('play-btn').classList.add('focused');
      }
    }
    setShowDetailPage(true);
    if (!showPlayerFromProgress && !isTrailer) {
      // if (window.document.getElementById('play-btn')) {
      //   window.document.getElementById('play-btn').classList.add('focused');
      // }
      if (window.document.getElementById('resume-from')) {
        window.document.getElementById('resume-from').classList.add('focused');
      }
    }
  };

  const handleSwitchDetailPage = (
    id,
    horizontalImage,
    verticalImage,
    portrait,
    data
  ) => {
    setDetailUpdatedData({});
    if (videos.length > 0) {
      const updateData = videos.filter((a) => a.title !== data.title);
      setMoreLikeThis(updateData);
    }
    setDetailUpdatedData(data);

    Array.from(
      document.querySelectorAll('.user-active .prj-element.focused')
    ).forEach((el) => {
      el.classList.remove('focused');
    });
    window.document.getElementById('play-btn').classList.add('focused');

    // const canvas = window.document.querySelector(
    //   `#details-portrait-${detailPageData.id}`
    // );
    // const verticalImg = verticalImage.split('?')[0];
    // const horizontalImg = horizontalImage.split('?')[0];
    // if (canvas) {
    //   const ctx = canvas.getContext('2d');

    //   const newImage = new Image();
    //   newImage.src = !portrait
    //     ? `${horizontalImg}?width=400&height=600&quality=30`
    //     : `${verticalImg}?width=560&height=315&quality=30`;
    //   newImage.onload = () => {
    //     ctx.clearRect(0, 0, !portrait ? 400 : 560, !portrait ? 600 : 315);
    //     ctx.imageSmoothingQuality = 'low';
    //     ctx.drawImage(
    //       newImage,
    //       0,
    //       0,
    //       portrait ? 400 : 560,
    //       portrait ? 600 : 315
    //     );
    //   };
    // }
    // e.preventDefault();
    window.document
      .getElementById(`detail-view-${detailPageData.id}`)
      .classList.remove('top-v');
    if (window.document.querySelectorAll('.video-details')) {
      if (detailPageData.isPortrait === true) {
        // window.document.querySelectorAll('.video-details')[0].style.marginTop =
        //   `197px`;
      } else {
        // window.document.querySelectorAll('.video-details')[0].style.marginTop =
        //   `221px`;
      }
    }
    const element = window.document.querySelector(`#${containerIdPrefix}${id}`);

    if (element !== null && element.length > 0) {
      element[0].click();
    }
    if (window.document.getElementById('resume-btn')) {
      window.document.getElementById('resume-btn').classList.remove('focused');
    }
    if (window.document.getElementById('play-btn')) {
      window.document.getElementById('play-btn').classList.add('focused');
    }
  };
  const handleScroll = () => {
    handleRowListScroll(scrollHandleButtonId);

    // Hide featured section
    // if (!focusInApplied) return;
    const hideSectionElement = window.document.getElementById(
      'hide-featured-section'
    );
    if (hideSectionElement) {
      hideSectionElement.click();
    }
  };
  const handleFocusIn = (type) => {
    window.document
      .getElementById(`detail-view-${detailPageData.id}`)
      .classList.remove('top-v');
    // handleScroll();
    if (type === "play") {
      voiceSpeak(currentProgress !== 0 ? `${playFromBeginningTitle} button` : `${playTitle} button`)
    } else if (type === "resume") {
      voiceSpeak(`Resume from ${convertSecToTime(currentProgress)} button`)
    }
  };

  const handleFocusInForRow = (title) => {
    window.document
      .getElementById(`detail-view-${detailPageData.id}`)
      .classList.add('top-v');
    handleScroll();
    voiceSpeak(title);
  };

  const handleFocusOut = () => {
    window.document
      .getElementById(`detail-view-${detailPageData.id}`)
      .classList.remove('top-v');
    // handleScroll();
  };

  const handleUpdateImageUrl = (type, updatedData) => {
    let imgUrl = '';
    if (type === 'landscape') {
      imgUrl =
        updatedData?.posterV ||
        updatedData.poster_9_16_small ||
        updatedData.poster_9_16;
      return imgUrl;
    }
    if (type === 'portrait') {
      imgUrl =
        updatedData?.posterH ||
        updatedData.poster_16_9_small ||
        updatedData.poster_16_9;
      return imgUrl;
    }
    return imgUrl;
  };
  // const goBack = () => {
  //   console.log('Go Back******');

  //   try {
  //     if (window.document.getElementById('bg-video-player')) {
  //       videojs('bg-player').play();
  //     }
  //   } catch (e) {
  //     // do nothing
  //   }
  //   // if (!showPlayer) {
  //   //   handleHideDetailPage();
  //   //   // setTimeout(() => {
  //   //   //   restoreFocus();
  //   //   // }, 1000);
  //   // }
  // };

  // const handleScroll = () => {
  //   const focusedElements = window.document.querySelectorAll(
  //     '.prj-element.focused'
  //   );

  //   if (focusedElements.length > 0) {
  //     if (detailPageData.isPortrait === true) {
  //       window.document.querySelectorAll('.video-details')[0].style.marginTop =
  //         `195px`;
  //     } else if (detailPageData.isPortrait === false) {
  //       window.document.querySelectorAll('.video-details')[0].style.marginTop =
  //         `239px`;
  //     }
  //   }
  // };

  // const handleScrollEle = () => {
  //   const focusedElements = window.document.querySelectorAll(
  //     '.prj-element.focused'
  //   );

  //   if (focusedElements.length > 0) {
  //     // scrollAppView(focusedElements[0]);
  //     window.document.querySelectorAll('.video-details')[0].style.marginTop =
  //       `-190px`;
  //   }
  // };

  // const mouseHover = (idx) => {
  //   Array.from(document.querySelectorAll('.prj-element.focused')).forEach(
  //     (el) => {
  //       el.classList.remove('focused');
  //     }
  //   );

  //   window.document.getElementById(idx).classList.add('focused');
  //   const focusedElements = window.document.querySelectorAll(
  //     '.prj-element.focused'
  //   );
  //   // if (focusedElements.length > 0) {
  //   //   scrollAppView(focusedElements[0], 'center');
  //   // }
  // };
  const handleHideFeaturedSection = () => {
    const element = window.document.getElementById('home-featured-container');
    if (element) {
      element.classList.add('not-active');
      window.CB.activeFeaturedItemIndex = 0;
    }

    const titleSection = window.document.getElementById(
      'title-description-section'
    );
    if (titleSection) {
      titleSection.classList.remove('hide');
    }
  };
  const handleShowFeaturedSection = () => {
    const element = window.document.getElementById('home-featured-container');
    if (element) {
      element.classList.remove('not-active');
    }

    const titleSection = window.document.getElementById(
      'title-description-section'
    );
    if (titleSection) {
      titleSection.classList.add('hide');
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    voiceSpeak(
      `${detailUpdatedData.title}; ${detailUpdatedData.rating}; ${detailUpdatedData.description
      }; ${currentProgress !== 0 ? playFromBeginningTitle : playTitle} button`
    );
  }, [
    currentProgress,
    detailUpdatedData.title,
    detailUpdatedData.rating,
    detailUpdatedData.description,
  ]);

  return (
    <DetailLayout>
      <div
        className="videos-details view user-active series-detail-page"
        id={`detail-view-${detailPageData.id}`}
        ref={ref}
      >
        <div
          className="bg-poster"
          id="bg-posters-000"
          style={{
            backgroundImage:
              openFrom === 'seriesPage'
                ? ` linear-gradient( rgb(10 9 10 / 31%), rgb(5 5 5 / 79%)), url("${detailPageData.posterH || detailPageData.poster}") `
                : 'unset',
          }}
        >
          {openFrom !== 'seriesPage' && (
            <img
              src={detailPageData.posterH || detailPageData.poster}
              alt={`${detailPageData.id}-thumb-${detailPageData.id}`}
              id={`${detailPageData.id}-thumb-${detailPageData.id}`}
              width={1920}
              height={1080}
              style={{
                objectFit: 'cover',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          )}
        </div>
        {/* <button
          type="button"
          className="hide"
          id="video-detail-focus"
          onClick={handleScroll}
        >
          Scroll
        </button> */}
        <div className="bg-poster-layer" />
        <div
          className="back-to-page prj-element"
          id="back-to-page"
          // onClick={goBack}
          aria-hidden
        >
          &lt; &nbsp; Back
        </div>
        <div className="video-details-main-div" id="video-detail-focus">
          <div className="video-details">
            <div className="details">
              <div className="title">{detailUpdatedData.title}</div>
              <div className="video-rating">{detailUpdatedData.rating}</div>
              <div className="description">{detailUpdatedData.description}</div>
              {showButtons && (
                <div className="buttons">
                  {currentProgress !== 0 && !detailPageData.isLive && (
                    <button
                      id="resume-btn"
                      type="button"
                      className="play-btn prj-element"
                      data-focus-left={false}
                      data-focus-right="#play-btn"
                      data-focus-up={false}
                      data-focus-down=".video.prj-element"
                      // data-on-self-focus="#video-detail-focus"
                      data-focus-in="#resume-btn-focus-in"
                      data-focus-out="#resume-btn-focus-out"
                      onClick={() => {
                        handlePlayerOpen(true);
                      }}
                    // onMouseEnter={() => mouseHover('resume-btn')}
                    >
                      <img src={resumeIcon} alt="resume" />
                      <span className="play-text">
                        Resume from {convertSecToTime(currentProgress)}
                      </span>
                    </button>
                  )}
                  <button
                    id="play-btn"
                    type="button"
                    className={
                      currentProgress === 0 || detailPageData.isLive
                        ? 'play-btn small prj-element focused'
                        : 'play-btn prj-element focused'
                    }
                    data-focus-left="#resume-btn"
                    data-focus-right={
                      detailUpdatedData.trailerUrl !== ''
                        ? '#trailer-btn'
                        : false
                    }
                    data-focus-up={false}
                    data-focus-down=".video.prj-element"
                    data-on-self-focus="#video-detail-focus"
                    data-focus-out="#play-btn-focus-out"
                    data-focus-in="#play-btn-focus-in"
                    onClick={() => {
                      handlePlayerOpen(false);
                    }}
                  // onMouseEnter={() => mouseHover('play-btn')}
                  >
                    <img src={playIcon} alt="play" />
                    {currentProgress === 0 || detailPageData.isLive ? (
                      <span className="play-text"> Play </span>
                    ) : (
                      <span className="play-text">Play from beginning</span>
                    )}
                  </button>
                  {detailUpdatedData.trailerUrl &&
                    detailUpdatedData.trailerUrl !== '' &&
                    detailUpdatedData.trailerUrl !== null && (
                      <button
                        id="trailer-btn"
                        type="button"
                        className="play-btn trailer-btn small prj-element"
                        data-focus-left={
                          currentProgress === 0 ? '#resume-btn' : '#play-btn'
                        }
                        data-focus-right={false}
                        data-focus-up={false}
                        data-focus-down=".video.prj-element"
                        data-on-self-focus="#video-detail-focus"
                        data-focus-out="#play-btn-focus-out"
                        data-focus-in="#play-btn-focus-in"
                        onClick={() => {
                          handlePlayerOpen(false, false);
                        }}
                      // onMouseEnter={() => mouseHover('play-btn')}
                      >
                        <img src={playIcon} alt="play" />
                        <span className="play-text">Trailer</span>
                      </button>
                    )}
                </div>
              )}
            </div>
            <div className="image">
              <div
                className={`image-wrap ${detailUpdatedData?.isPortrait ||
                  detailUpdatedData?.type === VIDEO_TYPES.MOVIES
                  ? 'portrait'
                  : 'landscape'
                  }`}
              >
                {isVisible && (
                  <img
                    src={handleUpdateImageUrl(
                      detailUpdatedData?.isPortrait ||
                        detailUpdatedData?.type === VIDEO_TYPES.MOVIES
                        ? 'portrait'
                        : 'landscape',
                      detailUpdatedData
                    )}
                    alt={`${detailUpdatedData.id}-thumb-${detailUpdatedData.id}`}
                    id={`${detailUpdatedData.id}-thumb-${detailUpdatedData.id}`}
                    width={detailUpdatedData.isPortrait ? 400 : 560}
                    height={detailUpdatedData.isPortrait ? 600 : 315}
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
          </div>

          {videos.length > 1 && (
            <div className="more-like-this">
              {/* <button
                type="button"
                className="hide"
                id={scrollHandleButtonId}
                onClick={handleScrollEle}
              >
                Scroll
              </button> */}
              <div className="vertical-scroll" id="vertical-video-scroll">
                <div
                  className="horizontal-list more-like-this-horizontal-list row-list"
                  id={scrollHandleButtonId}
                >
                  <div className="title">More Like This</div>
                  <div className="list items-container-h">
                    <div
                      className="list-container more-like-this-list-container"
                      id={`${scrollHandleButtonId}-row-scroll`}
                    // id="detailitem-row-scroll"
                    >
                      {moreLikeThis.map((v, idx) => (
                        <>
                          <div
                            className={`video prj-element media-element ${v.id}-vid ${detailPageData.isPortrait
                              ? 'portrait'
                              : 'landscape'
                              }`}
                            id={`detailitem${idx}v`}
                            key={`more-like-this-${v.id}`}
                            data-focus-left={
                              idx === 0 ? '' : `#detailitem${idx - 1}v`
                            }
                            data-focus-right={
                              idx + 1 === videos.length
                                ? ''
                                : `#detailitem${idx + 1}v`
                            }
                            data-focus-up="#play-btn"
                            // data-focus-down=".video.prj-element"
                            // data-on-self-focus={`#${scrollHandleButtonId}`}
                            data-focus-in={`#detailitem${idx}v-focus-in`}
                            // data-focus-out={focusOut}
                            // data-on-self-focus="#video-detail-focus"
                            onClick={() =>
                              // handleSwitchDetailPage(v.id || v._id)
                              handleSwitchDetailPage(
                                v.id || v._id,
                                v.posterH || v.poster,
                                v.posterV || v.poster,
                                // v.isPortrait,
                                detailPageData.isPortrait,
                                v
                              )
                            }
                            // onMouseEnter={() => mouseHover(`detailitem${idx}v`)}
                            role="none"
                          >
                            {/* <div className="img">
                              <div className="img-container">
                                <img
                                  src={
                                    detailPageData.isPortrait
                                      ? v.posterV || v.poster
                                      : v.posterH || v.poster
                                  }
                                  alt={v.title}
                                />
                              </div>
                            </div> */}
                            <DetailRowlist
                              isPortrait={detailPageData.isPortrait}
                              posterH={
                                v.posterH ||
                                v.poster_16_9_small ||
                                v.poster_16_9
                              }
                              posterV={
                                v.posterV ||
                                v.poster_9_16_small ||
                                v.poster_9_16
                              }
                              title={detailPageData.title}
                              id={`details-list-${idx}-${v.id}`}
                            />
                            {!detailPageData.isPortrait && (
                              <>
                                <p className="title">{v.title || ''}</p>
                                <p className="sub-title">
                                  {v.description || ''}
                                </p>
                              </>
                            )}
                            {/* <button
                            className="hide"
                            type="button"
                            id={`detailitem${idx}v-focus-out`}
                            onClick={handleFocusOut}
                          >
                            Focus Out
                          </button> */}
                          </div>

                          <button
                            className="hide"
                            type="button"
                            id={`detailitem${idx}v-focus-in`}
                            onClick={() => handleFocusInForRow(v.title)}
                          >
                            Focus In
                          </button>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            className="hide"
            type="button"
            id="play-btn-focus-in"
            onClick={() => handleFocusIn("play")}
          >
            Focus In
          </button>
          <button
            className="hide"
            type="button"
            id="resume-btn-focus-in"
            onClick={() => handleFocusIn("resume")}
          >
            Focus In
          </button>
          <button
            className="hide"
            type="button"
            id="play-btn-focus-out"
            onClick={() => handleFocusOut()}
          >
            Focus Out
          </button>
          <button
            className="hide"
            type="button"
            id="resume-btn-focus-out"
            onClick={() => handleFocusOut()}
          >
            Focus Out
          </button>
          <button
            className="hide"
            type="button"
            id="hide-featured-section"
            onClick={handleHideFeaturedSection}
          >
            Hide
          </button>
          <button
            className="hide"
            type="button"
            id="show-featured-section"
            onClick={handleShowFeaturedSection}
          >
            Show
          </button>
          {!showPlayer && <NavigateBack onBack={handleBack} />}
        </div>
        {showPlayer && (
          <Suspense>
            <Player
              id="player"
              videoData={detailUpdatedData}
              resumeFrom={showPlayerFromProgress ? currentProgress : 0}
              handlePlayerClose={handlePlayerClose}
              setShowDetailPage={setShowDetailPage}
              isTrailer={isTrailer}
            />
          </Suspense>
        )}
      </div>
    </DetailLayout>
  );
};

DetailPage.propTypes = {
  detailPageData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    poster: PropTypes.string,
    posterH: PropTypes.string,
    posterV: PropTypes.string,
    poster_16_9_small: PropTypes.string,
    poster_16_9: PropTypes.string,
    poster_9_16_small: PropTypes.string,
    poster_9_16: PropTypes.string,
    hlsUrl: PropTypes.string,
    isLive: PropTypes.bool,
    isPortrait: PropTypes.bool,
    genres: PropTypes.string,
    duration: PropTypes.number,
    category: PropTypes.string,
    channelId: PropTypes.number,
    director: PropTypes.string,
    actor1: PropTypes.string,
    actor2: PropTypes.string,
    actor3: PropTypes.string,
    rating: PropTypes.string,
    ratingSource: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    srtUrl: PropTypes.string,
    vttUrl: PropTypes.string,
    source: PropTypes.string,
    playDirectUrl: PropTypes.string,
    liveVastUrl: PropTypes.string,
    isExclusiveContent: PropTypes.string,
  }).isRequired,
  handleHideDetailPage: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  setShowDetailPage: PropTypes.func.isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      shortDescription: PropTypes.string,
      hlsUrl: PropTypes.string,
      poster: PropTypes.string,
      posterH: PropTypes.string,
      posterV: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      duration: PropTypes.number,
      type: PropTypes.string,
      genres: PropTypes.string,
      category: PropTypes.string,
      channelId: PropTypes.number,
      director: PropTypes.string,
      actor1: PropTypes.string,
      actor2: PropTypes.string,
      actor3: PropTypes.string,
      rating: PropTypes.string,
      ratingSource: PropTypes.string,
      season: PropTypes.number,
      episode: PropTypes.number,
      srtUrl: PropTypes.string,
      vttUrl: PropTypes.string,
      source: PropTypes.string,
      playDirectUrl: PropTypes.string,
      liveVastUrl: PropTypes.string,
      isExclusiveContent: PropTypes.string,
    })
  ).isRequired,
  containerIdPrefix: PropTypes.string.isRequired,
  openFrom: PropTypes.string,
};

DetailPage.defaultProps = {
  openFrom: '',
};

export default DetailPage;
