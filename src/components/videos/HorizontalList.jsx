/* eslint-disable no-nested-ternary */
/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import { getMenuVideoDetails } from '../../services/api.service';
import { getAllVideoProgress } from '../../utils/local-cache.util';
import handleRowListScroll from '../../utils/rowlist-scroll.utils';
import APP_CONFIG, { VIDEO_TYPES } from '../../config/app.config';
// import NoDataFound from './no-data-found.component';
import Loading from '../common/Loading';
import { sentryException } from '../../utils/sentry-logger.util';
import { logger } from '../../utils/helper.util';
import voiceSpeak from '../../utils/accessibility.util';

const HorizontalList = ({
  id,
  title,
  containerId,
  videosCount,
  type,
  activePage,
  activeSubPage,
  videosList,
  keyUpElement,
  keyDownElement,
  handleShowDetailPage,
  setActiveDetId,
  handleVideoData,
  searchType,
  handleOpenSeries,
  vastUrlRoku,
  handleLock,
  trailerUrl,
  perPageRows,
  activeRow,
  menuVideoDataList,
  setSearchPage,
  searchPage,
  searchData,
  subMenuData,
  uiSection,
  handleUpdateUISection,
  isRowReady,
  vidType,
}) => {
  const myArrayData = [];
  const reuseApiData = true;
  const videoProgress = getAllVideoProgress();
  const scrollHandleButtonId = `scroll-${containerId}`;

  if (id) {
    setActiveDetId(id);
  }

  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(true);
  const [videos, setVideos] = useState(videosList);
  const [rowVideos, setRowVideos] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const perPage = 20;

  const updateShowMoredata = (data) => {
    handleVideoData(rowVideos);
    handleShowDetailPage(data);
  };

  const onMenuVideoResponse = (res) => {
    // Handle different data formats
    let response = [];
    if (res?.content && Array.isArray(res.content)) {
      response = res.content;
    } else if (Array.isArray(res)) {
      response = res;
    } else if (res?.res && Array.isArray(res.res)) {
      response = res.res;
    } else if (res?.res && !Array.isArray(res.res)) {
      // Handle case where res.res might be an object with content
      response = res.res?.content || [];
    } else {
      logger.error('Invalid response format:', res);
      setDataLoaded(true);
      return;
    }

    const videosData = [];

    // Ensure response is an array
    if (!Array.isArray(response)) {
      logger.error('Response is not an array:', response);
      setDataLoaded(true);
      return;
    }

    response.forEach((v) => {
      videosData.push({
        id: v._id || v.id,
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
        rating: v.rating || '',
        ratingSource: v.rating_source || '',
        season: Number(v.season),
        episode: Number(v.episode),
        srtUrl: v.srt_url || '',
        vttUrl: v.vtt_url || '',
        source: v.source || '',
        playDirectUrl: v.playDirectUrl || '',
        liveVastUrl: v.liveVastUrl || '',
        vType: v.type || vidType || '',
        episodes: v.episodes,
        type,
        isExclusiveContent: v.isExclusiveContent || true,
        trailerUrl: v.trailerUrl,
      });
    });
    setRowVideos(videosData);
    setVideos((data) =>
      Array.isArray(data) ? [...data, ...videosData] : [...videosData]
    );
    setDataLoaded(true);
    setApiLoaded(false);
  };

  useEffect(() => {
    if (activePage === '') {
      setDataLoaded(true);
      return;
    }

    // Use the centralized batch loading system
    if (
      menuVideoDataList[id] &&
      menuVideoDataList[id].status === 'COMPLETED' &&
      menuVideoDataList[id].data &&
      menuVideoDataList[id].data[1]
    ) {
      // Check if the data is in the correct format
      const data = menuVideoDataList[id].data[1];

      // Try to handle different data formats
      if (data && typeof data === 'object') {
        // If data is already an array, use it directly
        if (Array.isArray(data)) {
          onMenuVideoResponse({ content: data });
        } else {
          // Otherwise, pass it as is and let onMenuVideoResponse handle it
          onMenuVideoResponse(data);
        }
        setApiDataLoaded(true);
      } else {
        logger.error(`Invalid data format for row ${id}:`, data);
      }
    }
  }, [activePage, id, menuVideoDataList]);

  // Load more horizontal data for this specific row
  const loadMoreHorizontalData = async () => {
    if (apiLoaded) return;

    setApiLoaded(true);
    const nextPage = page + 1;

    try {
      const res = await getMenuVideoDetails(activePage, id, nextPage, perPage);

      // Process the new data
      const response = res?.content || [];
      const videosData = [];
      response.forEach((v) => {
        videosData.push({
          id: v._id || v.id,
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
          rating: v.rating || '',
          ratingSource: v.rating_source || '',
          season: Number(v.season),
          episode: Number(v.episode),
          srtUrl: v.srt_url || '',
          vttUrl: v.vtt_url || '',
          source: v.source || '',
          playDirectUrl: v.playDirectUrl || '',
          liveVastUrl: v.liveVastUrl || '',
          vType: v.type || vidType || '',
          episodes: v.episodes,
          type,
          isExclusiveContent: v.isExclusiveContent || true,
          trailerUrl: v.trailerUrl,
        });
      });

      setVideos((prevVideos) => [...prevVideos, ...videosData]);
      setPage(nextPage);
      setApiLoaded(false);
    } catch (error) {
      sentryException(error);
      logger.error(`Error loading horizontal data for row ${id}:`, error);
      setApiLoaded(false);
    }
  };

  const handleScroll = () => {
    const focusedElements = window.document.querySelectorAll(
      '.user-active .prj-element.focused'
    );

    if (focusedElements.length > 0) {
      if (window.document.querySelectorAll('.page-container')) {
        window.document.querySelectorAll('.page-container')[0].style.marginTop =
          `107px`;
      }
    }

    const defaultFocus = APP_CONFIG.ROWLIST_CURRENT_SCROLL_BEHAVIOR;
    handleRowListScroll(containerId, defaultFocus);

    const hideSectionElement = window.document.getElementById(
      'hide-featured-section'
    );
    if (hideSectionElement) {
      hideSectionElement.click();
    }

    const { length } = videos;
    const currentFocus =
      focusedElements[0]?.dataset.focusPagination.split('-')[0];
    voiceSpeak(videos[currentFocus].title);
    if (searchType) {
      if (Number(currentFocus) >= videosCount - 10 && videosCount > 0) {
        setSearchPage(searchPage + 1);
      }
    }
    if (
      !searchType &&
      Number(currentFocus) >= length - 10 &&
      length > 0 &&
      !apiLoaded
    ) {
      loadMoreHorizontalData();
    }
  };

  // Check if this row is ready to be displayed
  const isThisRowReady = isRowReady(id);
  if (!dataLoaded || !isThisRowReady) {
    return <Loading size={80} showText={false} />;
  }

  return dataLoaded &&
    isThisRowReady &&
    (searchType ? searchData.length > 0 : videos.length > 0) ? (
    <div
      className={`horizontal-list for-scroll-width row-list ${type}`}
      id={containerId}
      role="none"
    >
      <div className="grid-title">{title}</div>
      <div
        className={`media-scroller items-container-h ${type}`}
        id={`${containerId}-row-scroll`}
      >
        {(searchType ? searchData : videos).map((v, idx) => (
          <Item
            key={`${id}v${v.id}-${idx}`}
            id={`item${id}v${v.id}-${idx}`}
            videoId={v.id}
            title={v.title}
            description={v.description}
            shortDescription={v.shortDescription}
            hlsUrl={v.hlsUrl}
            isLive={v.isLive}
            poster={v.poster}
            posterH={v.posterH}
            posterV={v.posterV}
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
            containerId={containerId}
            isExclusiveContent={v.isExclusiveContent}
            type={type}
            dataFocusLeft={
              idx === 0
                ? searchType
                  ? '.active-key.prj-element'
                  : '.side-nav .prj-element.active'
                : `#item${id}v${(searchType ? searchData : videos)[idx - 1].id}-${idx - 1}`
            }
            dataFocusRight={
              idx + 1 === (searchType ? searchData.length : videos.length)
                ? ''
                : `#item${id}v${(searchType ? searchData : videos)[idx + 1].id}-${idx + 1}`
            }
            dataFocusUp={keyUpElement || ''}
            dataFocusDown={keyDownElement || ''}
            dataOnSelfFocus={`#${scrollHandleButtonId}`}
            handleShowDetailPage={updateShowMoredata}
            dataOnPagination={`${idx}-${containerId}`}
            handleScroll={handleScroll}
            focusIn={`#item${id}v${v.id}-${idx}-focus-in`}
            index={idx}
            myArrayData={myArrayData}
            vType={v.vType || vidType}
            episodes={v.episodes}
            handleOpenSeries={handleOpenSeries}
            activeSubPage={activeSubPage}
            vastUrlRoku={vastUrlRoku}
            handleLock={handleLock}
            trailerUrl={v.trailerUrl}
            perPageRows={perPageRows}
            activeRow={activeRow}
            searchType={searchType}
            seriesContent={
              vidType === VIDEO_TYPES.SERIES ? v?.seriesContent : []
            }
          />
        ))}
        {/* Horizontal loading indicator */}
        {!searchType && apiLoaded && (
          <div className="horizontal-loader-container">
            <Loading size={80} showText={false} />
          </div>
        )}
      </div>
    </div>
  ) : null;
};

HorizontalList.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  videosCount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  activePage: PropTypes.string.isRequired,
  activeSubPage: PropTypes.string.isRequired,
  videosList: PropTypes.arrayOf(PropTypes.shape()),
  keyUpElement: PropTypes.string.isRequired,
  keyDownElement: PropTypes.string.isRequired,
  handleShowDetailPage: PropTypes.func.isRequired,
  setActiveDetId: PropTypes.func.isRequired,
  handleVideoData: PropTypes.func.isRequired,
  perPageRows: PropTypes.number.isRequired,
  activeRow: PropTypes.number.isRequired,
  searchType: PropTypes.bool,
  handleOpenSeries: PropTypes.func,
  vastUrlRoku: PropTypes.string,
  handleLock: PropTypes.func,
  trailerUrl: PropTypes.string,
  menuVideoDataList: PropTypes.object,
  setSearchPage: PropTypes.func,
  searchPage: PropTypes.number,
  searchData: PropTypes.array,
  subMenuData: PropTypes.object,
  uiSection: PropTypes.object,
  handleUpdateUISection: PropTypes.func,
  isRowReady: PropTypes.func,
  vidType: PropTypes.string,
};
HorizontalList.defaultProps = {
  videosList: [],
  searchType: false,
  handleOpenSeries: () => { },
  handleLock: () => { },
  menuVideoDataList: {},
  vastUrlRoku: '',
  trailerUrl: '',
  setSearchPage: () => { },
  searchPage: 1,
  searchData: [],
  subMenuData: {},
  uiSection: {},
  handleUpdateUISection: () => { },
  isRowReady: () => false,
  vidType: '',
};

export default HorizontalList;
