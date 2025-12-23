/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { lazy, Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { APP_PAGES, VIDEO_TYPES } from '../config/app.config';
import MainLayout from '../layout/main.layout';
import HorizontalList from '../components/videos/HorizontalList';
import Loading from '../components/common/Loading';
import { searchData } from '../services/api.service';
import TopMenu from '../components/common/TopMenu';
import NavigateBack from '../components/common/navigate-back.component';
import SeriesRowList from '../components/common/SeriesRowList';
import CustomKeyboard from '../components/common/custom-keyboard.component';
import voiceSpeak from '../utils/accessibility.util';

const DetailPage = lazy(() => import('../components/common/pages/DetailPage'));

const Search = ({ menuData, activePage, handlePageChange, abortSignal }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState({
    videos: [],
    movies: [],
    events: [],
    series: [],
    success: true,
    noData: false,
  });
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [detailPageData, setDetailPageData] = useState({});
  const [moreData, setMoreData] = useState([]);
  const [detId, setActiveDetId] = useState('');
  const [page, setPage] = useState(1);
  const [valueStore, setValueStore] = useState('');
  const [showSeries, setShowSeries] = useState(false);
  const [seriesData, setSeriesData] = useState({});
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesId, setSeriesId] = useState('');
  const [seriesVastRoku, setSeriesVastRoku] = useState('');
  const [seasonData, setSeasonData] = useState([]);

  // const [finalData,setFinalData] = useState({
  //   videos: [],
  //   movies: [],
  //   events: [],
  // });
  const perPage = 20;

  const localState = {
    timeout: null,
  };
  const mouseHover = (idx) => {
    Array.from(document.querySelectorAll('.prj-element.focused')).forEach(
      (el) => {
        el.classList.remove('focused');
      }
    );

    window.document.getElementById(idx).classList.add('focused');
    // eslint-disable-next-line no-unused-vars
    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );
    // if (!idx.includes('grid')) {
    //   handleFocusIn();
    // }
    // handleFocusIn();
    // if (focusedElements.length > 0) {
    //   scrollAppView(focusedElements[0], 'center');
    // }
  };

  // Function to append new data to videos and movies
  const appendData = (newVideos, newMovies, newEvents, newSeries) => {
    setData((prevState) => ({
      ...prevState,
      videos: [...prevState.videos, ...newVideos],
      movies: [...prevState.movies, ...newMovies],
      events: [...prevState.events, ...newEvents],
      series: [...prevState.series, ...newSeries],

      success: true,
      noData:
        prevState.videos.length === 0 &&
        prevState.movies.length === 0 &&
        prevState.events.length === 0 &&
        prevState.series.length === 0,
    }));
  };

  const searchApi = (value, p, per) => {
    searchData(value, abortSignal, p, per)
      .then((res) => {
        if (
          window.document.getElementById('custom-keyboard-textbox').text !==
          value
        ) {
          return;
        }

        const { content } = res;
        const finalData = {
          videos: [],
          movies: [],
          events: [],
          series: [],
        };
        (content.videos || []).forEach((v) => {
          finalData.videos.push({
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
            type: VIDEO_TYPES.VIDEO,
            isExclusiveContent: v.isExclusiveContent || true,
          });
        });
        (content.movies || []).forEach((v) => {
          finalData.movies.push({
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
            type: VIDEO_TYPES.MOVIES,
            isExclusiveContent: v.isExclusiveContent || true,
          });
        });
        (content.events || []).forEach((v) => {
          finalData.events.push({
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
            type: VIDEO_TYPES.EVENT,
            isExclusiveContent: v.isExclusiveContent || true,
          });
        });
        (content.series || []).forEach((v) => {
          finalData.series.push({
            id: v?.id,
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
            type: VIDEO_TYPES.SERIES,
            isExclusiveContent: v.isExclusiveContent || true,
            seriesContent: v,
          });
        });
        // setVideos((data) => [...data, ...videosData]);
        // finalData.videos = { ...finalData.videos, ...content.videos };

        if (p === 1) {
          setData({
            ...finalData,
            success: true,
            noData:
              finalData.videos.length === 0 &&
              finalData.movies.length === 0 &&
              finalData.events.length === 0 &&
              finalData.series.length === 0,
          });
        } else {
          appendData(
            finalData.videos,
            finalData.movies,
            finalData.events,
            finalData.series
          );
        }
        setSearching(false);
      })
      .catch((error) => {
        // Only handle non-abort errors
        if (error.name !== 'AbortError') {
          setData({
            videos: [],
            movies: [],
            events: [],
            series: [],
            success: false,
            noData: true,
          });
          setSearching(false);
        }
      });
  };

  const updateSearchData = (val) => {
    setSearching(true);

    if (val === '') {
      setSearching(false);
      setPage(1);
      setData({
        videos: [],
        movies: [],
        events: [],
        series: [],
        success: true,
        noData: false,
      });
      return;
    }
    setValueStore(val);
    searchApi(val, page, perPage);
  };

  const handleHideDetailPage = () => {
    setShowDetailPage(false);
  };
  const handleVideoData = (moreD = []) => {
    setMoreData(moreD);
  };
  const handleShowDetailPage = (d) => {
    setShowDetailPage(false);
    setDetailPageData(d);
    setShowDetailPage(true);
  };
  const handleOpenSeries = (seriesInfo) => {
    setSeriesLoading(true);

    const episodeData = seriesInfo?.seriesContent?.episodes
      ? seriesInfo?.seriesContent?.episodes
      : [];

    const seasons = episodeData
      .map((item) => item.season)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    const result = {};

    for (let i = 0; i < seasons.length; i += 1) {
      const key = `Season: ${seasons[i]}`;

      const season = episodeData?.filter((s) => s.season === seasons[i]);
      result[key] = season;
    }
    const keyWiseObjects = Object.keys(result).map((key) => ({
      key,
      values: result[key],
    }));
    setSeriesData(seriesInfo?.seriesContent);
    setSeasonData(keyWiseObjects);
    setSeriesLoading(false);
    setSeriesId(seriesInfo?.activeSubPage);
    setSeriesVastRoku(seriesInfo?.vastRoku);
    setShowSeries((prev) => !prev);
  };
  const handleCloseSeries = () => {
    setShowSeries((prev) => !prev);
  };
  const handleSearchChange = (str) => {
    clearTimeout(localState.timeout);
    setQuery(str);

    localState.timeout = setTimeout(() => {
      window.document.getElementById('custom-keyboard-textbox').text = str;
      updateSearchData(str);
    }, 250);
  };

  useEffect(() => {
    if (valueStore !== '') {
      searchApi(valueStore, page, perPage);
    }
  }, [page, abortSignal]);

  const handleBack = () => {
    if (showDetailPage) {
      handleHideDetailPage();
      voiceSpeak(detailPageData?.title);
    } else {
      handlePageChange(APP_PAGES.HOME);
    }
  };

  return (
    <MainLayout
    // menuData={menuData}
    // activePage={activePage}
    // handlePageChange={handlePageChange}
    >
      <div
        className="page-container search-page view-container view user-active"
        id="search-page"
      >
        <TopMenu
          menuData={menuData}
          activePage={activePage}
          handlePageChange={handlePageChange}
        // activePageLayoutType={activePageLayout.layout}
        />

        <div className="content-container with-header">
          <div className="search-sub-container">
            <div className="key-board-container">
              <CustomKeyboard
                customUpKeyEvent=".prj-element.active"
                customRightKeyEvent=".user-active .prj-element.active-list"
                isFocused=""
                callbackInput={handleSearchChange}
                inputVal={query}
              />
            </div>
            <div className="video-grid-header-container">
              <div className="video-grid-container with-search">
                {searching && <Loading />}
                {query === '' && !searching && (
                  <div className="searching">
                    Search result will appear here
                  </div>
                )}
                {data.noData && query !== '' && (
                  <div className="searching">No data found</div>
                )}

                {!searching && query !== '' && (
                  <div className="page-content home-normal-rows">
                    <div className="vertical-scroll" id="vertical-scroll">
                      {data?.videos.length > 0 && (
                        <HorizontalList
                          id={1}
                          title="Videos"
                          containerId="hl-1"
                          videosCount={data.videos.length}
                          type={`${VIDEO_TYPES.VIDEO} search-list`}
                          activePage=""
                          activeSubPage=""
                          videosList={data.videos}
                          searchData={data.videos}
                          isExclusiveContent={data.isExclusiveContent}
                          keyUpElement="#top-menu-search"
                          keyDownElement={
                            data?.movies.length > 0
                              ? '.hl-2'
                              : data?.events.length > 0
                                ? '.hl-3'
                                : '.hl-4'
                          }
                          setActiveDetId={setActiveDetId}
                          handleHideDetailPage={handleHideDetailPage}
                          handleShowDetailPage={handleShowDetailPage}
                          handleVideoData={handleVideoData}
                          searchType
                          setSearchPage={setPage}
                          searchPage={page}
                          isRowReady={() => true}
                        />
                      )}

                      {data?.movies.length > 0 && (
                        <HorizontalList
                          id={2}
                          isExclusiveContent={data.isExclusiveContent}
                          title="Movies"
                          containerId="hl-2"
                          videosCount={data.movies.length}
                          type={`${VIDEO_TYPES.MOVIES} search-list`}
                          activePage=""
                          activeSubPage=""
                          videosList={data.movies}
                          searchData={data.movies}
                          keyUpElement={
                            data?.videos.length > 0 ? '.hl-1' : '#search-input'
                          }
                          keyDownElement={
                            data?.events.length > 0 ? '.hl-3' : '.hl-4'
                          }
                          setActiveDetId={setActiveDetId}
                          handleHideDetailPage={handleHideDetailPage}
                          handleShowDetailPage={handleShowDetailPage}
                          handleVideoData={handleVideoData}
                          searchType
                          focusOut="2-focus-out"
                          setSearchPage={setPage}
                          searchPage={page}
                          isRowReady={() => true}
                        />
                      )}

                      {data?.events.length > 0 && (
                        <HorizontalList
                          id={3}
                          isExclusiveContent={data.isExclusiveContent}
                          title="Events"
                          containerId="hl-3"
                          videosCount={data.events.length}
                          type={`${VIDEO_TYPES.EVENT} search-list`}
                          activePage=""
                          activeSubPage=""
                          videosList={data.events}
                          searchData={data.events}
                          keyUpElement={
                            data?.movies.length > 0
                              ? '.hl-2'
                              : data?.videos.length > 0
                                ? '.hl-1'
                                : '#search-input'
                          }
                          keyDownElement=".hl-4"
                          setActiveDetId={setActiveDetId}
                          handleHideDetailPage={handleHideDetailPage}
                          handleShowDetailPage={handleShowDetailPage}
                          handleVideoData={handleVideoData}
                          searchType
                          focusOut="3-focus-out"
                          setSearchPage={setPage}
                          searchPage={page}
                          isRowReady={() => true}
                        />
                      )}

                      {data?.series?.length > 0 && (
                        <HorizontalList
                          id={4}
                          isExclusiveContent={data.isExclusiveContent}
                          title={
                            data?.series?.[0]?.seriesContent?.episodes
                              ? 'Series'
                              : ''
                          }
                          containerId="hl-4"
                          videosCount={data.series.length}
                          type={`${VIDEO_TYPES.SERIES} search-list`}
                          vidType={VIDEO_TYPES.SERIES}
                          activePage=""
                          activeSubPage=""
                          videosList={data.series}
                          searchData={data.series}
                          keyUpElement={
                            data?.events.length > 0
                              ? '.hl-3'
                              : data?.movies.length > 0
                                ? '.hl-2'
                                : data?.videos.length > 0
                                  ? '.hl-1'
                                  : '#search-input'
                          }
                          setActiveDetId={setActiveDetId}
                          handleOpenSeries={handleOpenSeries}
                          handleVideoData={handleVideoData}
                          searchType
                          focusOut="4-focus-out"
                          setSearchPage={setPage}
                          searchPage={page}
                          isRowReady={() => true}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <NavigateBack onBack={handleBack} />
      </div>
      {showDetailPage && (
        <Suspense>
          <DetailPage
            detailPageData={detailPageData}
            handleHideDetailPage={handleHideDetailPage}
            videos={moreData}
            containerIdPrefix={`item${detId}v`}
            setShowDetailPage={setShowDetailPage}
            handleBack={handleBack}
          />
        </Suspense>
      )}
      {!seriesLoading && showSeries && (
        <Suspense>
          <SeriesRowList
            seriesData={seriesData}
            seasonData={seasonData}
            handleCloseSeries={handleCloseSeries}
            seriesId={seriesId}
            seriesVastRoku={seriesVastRoku}
          />
        </Suspense>
      )}
    </MainLayout>
  );
};

Search.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePage: PropTypes.string.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  abortSignal: PropTypes.object,
};

Search.defaultProps = {
  abortSignal: null,
};

export default Search;
