/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Item from '../videos/Item';
// import DetailPage from './pages/DetailPage';
import { getMenuVideoDetails } from '../../services/api.service';
import { getAllVideoProgress } from '../../utils/local-cache.util';
import showExitApp from '../../utils/app-exist.util';
import NoDataFound from '../videos/no-data-found.component';
// import scrollAppView from '../../utils/scrollAppView.util';

const DetailPage = lazy(() => import('./pages/DetailPage'));

const Grid = ({
  id,
  containerId,
  // videosCount,
  type,
  activePage,
  activeSubPage,
  videosList,
  // keyUpElement,
  // keyDownElement,
}) => {
  // const videosLength = activePage === '' ? videosList.length : videosCount;
  const videoProgress = getAllVideoProgress();
  // const scrollHandleButtonId = `scroll-${containerId}`;
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [videos, setVideos] = useState(videosList);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [detailPageData, setDetailPageData] = useState({});
  // const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    if (window.document.querySelectorAll('.page-container')) {
      window.document.querySelectorAll('.page-container')[0].style.marginTop =
        `119px`;
    }
  }, []);

  useEffect(() => {
    if (activePage === '') {
      setDataLoaded(true);
      return;
    }

    getMenuVideoDetails(activePage, activeSubPage, page, perPage).then(
      (res) => {
        const response = res.content.videos;
        const videosData = [];
        response.forEach((v) => {
          videosData.push({
            id: v._id,
            title: v.title,
            description: v.description || '',
            shortDescription: v.short_description || '',
            hlsUrl: v.hls_url,
            isLive: v?.is_live || false,
            poster: v.poster,
            posterH: v.poster_16_9_small || v.poster_16_9,
            posterV: v.poster_9_16_small || v.poster_9_16,
            startTime: v.start_date_time || '',
            endTime: v.end_date_time || '',
            duration: Number(v.duration || 0),
            genres: v.genres || '',
            category: v.category || '',
            channelId: Number(v.channel_id),
            director: v.director || '',
            actor1: v.actor1 || '',
            actor2: v.actor2 || '',
            actor3: v.actor3 || '',
            rating: v.rating,
            ratingSource: v.rating_source || '',
            season: Number(v.season),
            episode: Number(v.episode),
            srtUrl: v.srt_url || '',
            vttUrl: v.vtt_url || '',
            source: v.source || '',
            playDirectUrl: v.playDirectUrl || '',
            liveVastUrl: v.liveVastUrl || '',
            type,
          });
        });
        setVideos((data) => [...data, ...videosData]);
        setDataLoaded(true);
      }
    );
  }, [activeSubPage, page]);

  const handleShowDetailPage = (data) => {
    setShowDetailPage(false);
    setDetailPageData(data);
    setShowDetailPage(true);
  };
  const handleHideDetailPage = () => {
    setShowDetailPage(false);
    // setDetailPageData({});
  };

  // const handleScroll = () => {
  //   const focusedElements = window.document.querySelectorAll(
  //     '.prj-element.focused'
  //   );
  //   if (focusedElements.length > 0) {
  //     const currentFocus =
  //       focusedElements[0].dataset.focusPagination.split('-')[0];
  //     if (Number(currentFocus) === videos.length - 1) {
  //       setPage(page + 1);
  //     }
  //   }
  // };
  const handleBack = () => {
    if (showDetailPage) {
      handleHideDetailPage();
    } else {
      showExitApp();
    }
  };
  if (!dataLoaded) {
    return <>&nbsp;</>;
  }

  return (
    <>
      <div className="grid-list" id={containerId}>
        <button
          type="button"
          className="hide"
          // id={scrollHandleButtonId}
          // onClick={handleScroll}
        >
          Scroll
        </button>
        <div className="media-container">
          {videos.length === 0 && (
            <div className="no-data-available">
              <NoDataFound />
            </div>
          )}
          {videos.length > 0 &&
            videos.map((v, idx) => (
              <Item
                key={`${id}gridv${v.id}`}
                id={`item${id}gridv${v.id}index${idx}`}
                videoId={v.id}
                title={v.title}
                description={v.description}
                shortDescription={v.shortDescription}
                hlsUrl={v.hlsUrl}
                poster={v.poster}
                posterH={v.posterH || v.poster_16_9_small || v.poster_16_9}
                posterV={v.posterV || v.poster_9_16_small || v.poster_9_16}
                startTime={v.startTime}
                endTime={v.endTime}
                duration={v.duration}
                progress={Number(videoProgress[v.id] || 0)}
                genres={v.genres}
                category={v.category}
                channelId={v.channelId}
                director={v.director}
                actor1={v.actor1}
                actor2={v.actor2}
                actor3={v.actor3}
                rating={v.rating}
                ratingSource={v.ratingSource}
                season={v.season}
                episode={v.episode}
                srtUrl={v.srtUrl}
                vttUrl={v.vttUrl}
                source={v.source}
                playDirectUrl={v.playDirectUrl}
                liveVastUrl={v.liveVastUrl}
                type={type}
                episodes={[]}
                dataFocusLeft={
                  idx % 2 === 0
                    ? '.side-nav .prj-element.active'
                    : idx % 2 === 0
                      ? false
                      : `#item${id}gridv${videos[idx - 1].id}index${idx - 1}`
                }
                dataFocusRight={
                  idx % 2 === 0
                    ? `#item${id}gridv${videos[idx + 1]?.id}index${idx + 1}`
                    : false
                }
                dataFocusUp={
                  idx < 2
                    ? '.top-navigation .prj-element.active'
                    : `#item${id}gridv${videos[idx - 2].id}index${idx - 2}`
                }
                dataFocusDown={
                  idx > videos.length - 3
                    ? ''
                    : `#item${id}gridv${videos[idx + 2].id}index${idx + 2}`
                }
                // dataOnSelfFocus={`#${scrollHandleButtonId}`}
                handleShowDetailPage={handleShowDetailPage}
                dataOnPagination={`${idx}-${containerId}`}
              />
            ))}
        </div>
      </div>

      {showDetailPage && (
        <div className="grid-detail-page">
          <Suspense>
            <DetailPage
              detailPageData={detailPageData}
              videos={videos}
              containerIdPrefix={`item${id}gridv`}
              setShowDetailPage={setShowDetailPage}
              handleBack={handleBack}
            />
          </Suspense>
        </div>
      )}
    </>
  );
};

Grid.propTypes = {
  id: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  // videosCount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  activePage: PropTypes.string.isRequired,
  activeSubPage: PropTypes.string.isRequired,
  videosList: PropTypes.arrayOf(PropTypes.shape()),
  // keyUpElement: PropTypes.string.isRequired,
  // keyDownElement: PropTypes.string.isRequired,
};
Grid.defaultProps = {
  videosList: [],
};

export default Grid;
