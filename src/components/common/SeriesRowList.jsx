/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React, { lazy, Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import SeriesLayOut from '../../layout/series.layout';
import handleRowListScroll from '../../utils/rowlist-scroll.utils';
import NavigateBack from './navigate-back.component';
// import DetailPage from './pages/DetailPage';
// import Loading from './Loading';
import SeriesCanvas from './seriesCanvas';
import convertSecToTime from '../../utils/timeformat.util';
import backIcon from '../../assets/images/back.png';

const DetailPage = lazy(() => import('./pages/DetailPage'));

const SeriesRowList = ({
  seriesData,
  seasonData,
  handleCloseSeries,
  seriesVastRoku,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  // const [deId, setDeId] = useState('');
  const [dtData, setDtData] = useState({});

  const handleScroll = (I) => {
    handleRowListScroll(I);
  };
  const handleFocusIn = (ID) => {
    handleScroll(ID);
  };
  const handleOpen = (data) => {
    setDtData(data);
    setShowDetail(true);
  };
  const handleHideDetail = () => {
    setShowDetail(!showDetail);
  };
  return (
    <>
      <SeriesLayOut>
        <div
          className="fullscreen-series-container-fixed view user-active"
          id="series-page"
        >
          {seriesData && (
            <div className="series-title">
              <div className="series-title-container">
                <img
                  src={backIcon}
                  alt="Back"
                  className="back-icon"
                  style={{
                    width: '64px',
                    height: '64px',
                    verticalAlign: 'middle',
                    marginRight: '18px',
                    cursor: 'pointer',
                  }}
                  onClick={handleCloseSeries}
                />
                {seriesData.title}
              </div>
            </div>
          )}
          <div
            className="horizontal-list for-scroll-width row-list video"
            role="none"
          >
            <div className="series-scroller home-normal-rows">
              <div
                className="season-main-container vertical-scroll"
                id="vertical-scroll"
              >
                {seasonData.map((v, idx) => (
                  <div
                    className="row-list series-section-rowlist"
                    id={`season-title${idx}`}
                    role="none"
                  >
                    <div className="grid-title">{v.key}</div>
                    <div
                      className="season-rowlist media-scroller items-container-h video "
                      id={`season-title${idx}-row-scroll`}
                    >
                      {v.values.map((va, index) => (
                        <>
                          <div
                            className={
                              index === 0 && idx === 0
                                ? `media-element landscape prj-element focused season-title${idx}`
                                : `media-element landscape prj-element season-title${idx}`
                            }
                            role="none"
                            key={`season-rowlist-value-${index}-${va._id}`}
                            id={`season-rlist${va._id}`}
                            data-focus-left={
                              index === 0
                                ? false
                                : `#season-rlist${v.values[index - 1]?._id}`
                            }
                            data-focus-right={
                              index + 1 === v.values.length
                                ? false
                                : `#season-rlist${v.values[index + 1]?._id}`
                            }
                            data-focus-up={
                              idx === 0
                                ? false
                                : `#season-title${idx - 1} .prj-element`
                            }
                            data-focus-down={
                              idx + 1 === seasonData.length
                                ? ''
                                : `#season-title${idx + 1} .prj-element`
                            }
                            data-focus-in={`#season-rlist${index}${va._id}-focus-in`}
                            onClick={() =>
                              handleOpen({
                                id: va._id,
                                title: va.title,
                                description: va.description,
                                poster: va.poster,
                                posterH:
                                  va.posterH ||
                                  va.poster_16_9_small ||
                                  va.poster_16_9,
                                posterV:
                                  va.posterV ||
                                  va.poster_9_16_small ||
                                  va.poster_9_16,
                                hlsUrl: va.hlsUrl || va.hls_url,
                                isLive: v?.is_live || false,
                                genres: va.genres,
                                duration: va.duration,
                                category: va.category,
                                channelId: va.channelId,
                                director: va.director,
                                actor1: va.actor1,
                                actor2: va.actor2,
                                actor3: va.actor3,
                                rating: va.rating,
                                ratingSource: va.ratingSource,
                                season: va.season,
                                episode: va.episode,
                                srtUrl: va.srtUrl,
                                vttUrl: va.vttUrl,
                                source: va.source,
                                playDirectUrl: va.playDirectUrl,
                                liveVastUrl: va.liveVastUrl,
                                seriesData: v.values,
                                vastRoku: seriesVastRoku,
                                // isPortrait:va.posterH,
                              })
                            }
                          >
                            <div className="img">
                              {' '}
                              <div className="img-container">
                                <SeriesCanvas
                                  // seriesCanvasId={`${index}-series-image-${va._id}`}
                                  seriesCanvasId={`series-image-${va._id}`}
                                  seriesImage={
                                    va.posterH ||
                                    va.poster_16_9_small ||
                                    va.poster_16_9
                                  }
                                />
                                {/* <img src={va.poster} alt={`ima-${index}`} /> */}
                              </div>
                            </div>

                            <div className="title">{va.title}</div>
                            {/* <div className="sub-title">
                              {va.description || ''}
                            </div> */}
                            <div className="video-duration">
                              {convertSecToTime(va.duration)}
                            </div>
                          </div>
                          <button
                            className="hide"
                            type="button"
                            id={`season-rlist${index}${va._id}-focus-in`}
                            onClick={() => handleFocusIn(`season-title${idx}`)}
                          >
                            Focus In
                          </button>
                          {/* <NavigateBack onBack={handleCloseSeries} /> */}
                        </>
                      ))}
                    </div>
                    {/* </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NavigateBack onBack={handleCloseSeries} />
        </div>
      </SeriesLayOut>
      {showDetail && (
        <Suspense>
          <DetailPage
            detailPageData={dtData}
            handleHideDetailPage={handleHideDetail}
            videos={dtData.seriesData}
            // containerIdPrefix={`item${seriesId}v`}
            // setDeId={setDeId}
            containerIdPrefix="season-rlist"
            setShowDetailPage={setShowDetail}
            handleBack={handleHideDetail}
            openFrom="seriesPage"
            handleSeriesDetailPage={handleOpen}
          />
        </Suspense>
      )}
    </>
  );
};

SeriesRowList.propTypes = {
  seriesData: PropTypes.object.isRequired,
  seasonData: PropTypes.array.isRequired,
  handleCloseSeries: PropTypes.func.isRequired,
  seriesVastRoku: PropTypes.string.isRequired,
};

export default SeriesRowList;
