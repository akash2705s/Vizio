/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState, lazy, Suspense, useRef } from 'react';
import videojs from 'video.js';
import PropTypes from 'prop-types';
import { PAGE_LAYOUT, SHOW_DETAIL_PAGE } from '../config/app.config';
import Loading from '../components/common/Loading';
import SideMenu from '../components/common/SideMenu';
import Main from '../layout/main.layout';
import {
  getEpisodes,
  getMenuDetails,
  getMenuVideoDetailsForAll,
} from '../services/api.service';
import HorizontalList from '../components/videos/HorizontalList';
import NavigateBack from '../components/common/navigate-back.component';
import TopMenu from '../components/common/TopMenu';
import BgPlayer from '../components/common/BgPlayer';
import Grid from '../components/common/Grid.component';
import NoDataFound from '../components/videos/no-data-found.component';

import { sentryException } from '../utils/sentry-logger.util';
import { logger } from '../utils/helper.util';
import showExitApp from '../utils/app-exist.util';
import { getLocalValue, setLocalValue } from '../utils/local-cache.util';
import AgeVerificationPrompt from '../components/prompts/age-verification.component';
import Player from '../components/common/Player';
import voiceSpeak from '../utils/accessibility.util';

const DetailPage = lazy(() => import('../components/common/pages/DetailPage'));
const SeriesRowList = lazy(() => import('../components/common/SeriesRowList'));

const Home = ({
  menuData,
  activePage,
  activePageLayout,
  handlePageChange,
  abortSignal = null,
  isMenuError = false,
}) => {
  const [showVideo, setShowVideo] = useState(
    activePageLayout.bgVideo !== '' &&
    activePageLayout.layout === PAGE_LAYOUT.RAIL
  );

  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const subMenuData = useRef([]);
  // eslint-disable-next-line no-unused-vars
  const videosData = useRef({});

  const [activeSubPage, setActiveSubPage] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [subPageLoaded, setSubPageLoaded] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [detailPageData, setDetailPageData] = useState({});
  const [moreData, setMoreData] = useState([]);
  const [detId, setActiveDetId] = useState('');
  const [noPlaylist, setNoPlayList] = useState(0);
  const [showSeries, setShowSeries] = useState(false);
  const [seriesData, setSeriesData] = useState({});
  const [seasonData, setSeasonData] = useState([]);
  const [seriesId, setSeriesId] = useState('');
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [seriesVastRoku, setSeriesVastRoku] = useState('');
  const [vLock, setVlock] = useState('nothanks');
  const menuVideoDataList = useRef({});
  const filteredSubMenuData = useRef([]);
  const [showFiltered, setShowFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiDataCalled = useRef(false);
  const [updateUISection, setUpdateUISection] = useState(false);
  const [isError, setIsError] = useState(false);

  const addRowRef = useRef(0);
  const keyPerformed = useRef('');
  const slicedRowHeight = useRef(0);
  const dataSection = useRef({
    total: 0,
    data: {
      rows: {},
      key: [], // Items with id[key]:value (rowlist array of objects)
      totalRenderRows: filteredSubMenuData.current.length,
      receivedRenderRows: addRowRef.current,
    },
  });
  const uiSection = useRef({
    perPage: 7,
    focused: {
      rowIndex: 0,
      columnINdex: 1,
    },
    marginAdjust: {},
    bufferRow: 3,
    removerows: 0,
    addRowIndex: 7,
    lowIndex: 0, //
    heighestIndex: 7, //
    dynamicallyAdd: 2,
    keyPerformed: keyPerformed.current,
    addPagination: 5,
  });
  const resetData = () => {
    videosData.current = {};
    uiSection.current = {
      perPage: 7,
      focused: {
        rowIndex: 0,
        columnINdex: 1,
      },
      marginAdjust: {},
      bufferRow: 3,
      removerows: 0,
      addRowIndex: 7,
      lowIndex: 0, //
      heighestIndex: 7, //
      dynamicallyAdd: 2,
      keyPerformed: keyPerformed.current,
      addPagination: 5,
    };
  };

  const afterDataLoad = () => {
    setPageLoaded(true);
    setSubPageLoaded(true);
  };

  const handleAgeVerificationYes = () => {
    // Store age verification in localStorage
    setLocalValue('ageVerified', 'true');
    setShowAgeVerification(false);
  };

  const handleAgeVerificationNo = () => {
    // Exit the app if user is not 18+
    if (window.VIZIO) {
      window.VIZIO.exitApplication();
    }
  };

  // Check age verification on component mount
  useEffect(() => {
    const isAgeVerified = getLocalValue('ageVerified', false);
    if (isAgeVerified !== 'true' && isAgeVerified !== true) {
      setShowAgeVerification(true);
    }
  }, []);
  // Optimized vertical pagination system
  const [verticalPagination, setVerticalPagination] = useState({
    currentPage: 0,
    itemsPerPage: 5,
    loadedRows: 0,
    totalRows: 0,
    isLoading: false,
    hasMore: true,
    currentBatchLoading: false,
    readyRows: [],
  });

  const loadNextBatch = async (filterRows, startIndex) => {
    if (!verticalPagination.hasMore) return;

    setVerticalPagination((prev) => ({
      ...prev,
      isLoading: true,
      currentBatchLoading: true,
    }));

    const endIndex = Math.min(
      startIndex + verticalPagination.itemsPerPage,
      filterRows.length
    );
    const rowsToLoad = filterRows.slice(startIndex, endIndex);

    // Create promises for the current batch
    const videoPromises = rowsToLoad.map((row, index) => {
      const actualIndex = startIndex + index;
      return new Promise((resolve) => {
        getMenuVideoDetailsForAll(activePage, row.id, 1, 20, abortSignal)
          .then((res) => {
            const tempResponse = menuVideoDataList.current;
            if (!tempResponse[row.id]) {
              tempResponse[row.id] = {
                total: 0,
                data: { 1: [] },
                status: 'PENDING',
              };
            } else if (!tempResponse[row.id].data[1]) {
              tempResponse[row.id].data[1] = [];
            }
            tempResponse[row.id].total = videosData.current[row.id]?.totalCount;
            tempResponse[row.id].data[1] = res.res;
            tempResponse[row.id].status = 'COMPLETED';
            subMenuData.current[actualIndex].status = 'COMPLETED';

            menuVideoDataList.current = tempResponse;

            resolve({ res: menuVideoDataList.current, rowId: row.id });
          })
          .catch((error) => {
            // Only handle non-abort errors

            if (error.name !== 'AbortError') {
              sentryException(error);
              if (startIndex === 0) {
                setIsError(true);
              }
              logger.error('API request error:', error);
            }
            resolve({ error: true });
          });
      });
    });

    try {
      await Promise.all(videoPromises);

      // Only update UI after ALL rows in the batch are ready
      const newReadyRows = [...verticalPagination.readyRows];
      for (let i = startIndex; i < endIndex; i += 1) {
        if (!newReadyRows.includes(filterRows[i].id)) {
          newReadyRows.push(filterRows[i].id);
        }
      }

      // Update pagination state
      setVerticalPagination((prev) => ({
        ...prev,
        loadedRows: endIndex,
        currentPage: prev.currentPage + 1,
        isLoading: false,
        currentBatchLoading: false,
        hasMore: endIndex < filterRows.length,
        readyRows: newReadyRows,
      }));

      // Update filtered data to show only ready rows
      // Get all ready rows in the correct order
      const readyRowsData = filterRows.filter((row) =>
        newReadyRows.includes(row.id)
      );
      filteredSubMenuData.current = readyRowsData;

      // Force React to detect the state change by creating a new array
      setShowFiltered([...readyRowsData]);

      // Force a re-render to ensure UI updates
      setUpdateUISection((prev) => !prev);

      // If this is the first batch, trigger afterDataLoad
      if (startIndex === 0) {
        afterDataLoad();
      } else {
        // For subsequent batches, ensure proper focus management
        setTimeout(() => {
          // Restore focus after batch loading
          const currentFocusIndex = addRowRef.current;
          const totalLoaded = endIndex; // Use endIndex instead of old state

          // If user was at the end of previous batch, move focus to first row of new batch
          if (
            currentFocusIndex >=
            totalLoaded - verticalPagination.itemsPerPage
          ) {
            const newFocusIndex = totalLoaded - verticalPagination.itemsPerPage;
            if (
              newFocusIndex >= 0 &&
              newFocusIndex < filteredSubMenuData.current.length
            ) {
              addRowRef.current = newFocusIndex;
              // Trigger focus update
              setUpdateUISection((prev) => !prev);
            }
          }
        }, 100);
      }
    } catch (error) {
      logger.error('Error loading batch:', error);
      setVerticalPagination((prev) => ({
        ...prev,
        isLoading: false,
        currentBatchLoading: false,
      }));
    }
  };

  const loadInitialData = (filterRows) => {
    dataSection.current.data = filterRows;
    setVerticalPagination((prev) => ({
      ...prev,
      totalRows: filterRows.length,
      loadedRows: 0,
      currentPage: 0,
      hasMore: filterRows.length > 0,
      readyRows: [],
      currentBatchLoading: false,
    }));

    // Initialize data structure for all rows
    Array.from(filterRows).forEach((row) => {
      const emptyResponse = menuVideoDataList.current;
      emptyResponse[row.id] = { total: 0, data: {}, status: 'PENDING' };
      menuVideoDataList.current = emptyResponse;
    });

    // Load first batch of rows
    loadNextBatch(filterRows, 0);
  };

  const loadMoreRows = () => {
    if (
      !verticalPagination.hasMore ||
      verticalPagination.isLoading ||
      verticalPagination.currentBatchLoading
    )
      return;

    const nextStartIndex = verticalPagination.loadedRows;
    loadNextBatch(dataSection.current.data, nextStartIndex);
  };

  // Utility function to check if a row is ready to be displayed
  const isRowReady = (rowId) => {
    const isReady =
      menuVideoDataList.current[rowId] &&
      menuVideoDataList.current[rowId].status === 'COMPLETED';
    return isReady;
  };

  // Check if we can navigate to next row
  const canNavigateToRow = (targetRowIndex) => {
    if (targetRowIndex >= showFiltered.length) {
      return false;
    }
    const targetRow = showFiltered[targetRowIndex];
    if (!targetRow) {
      return false;
    }
    const isReady = isRowReady(targetRow.id);
    return isReady;
  };

  // Show loading indicator when batch is loading
  const renderLoadingIndicator = () => {
    if (
      verticalPagination.currentBatchLoading &&
      verticalPagination.currentPage > 0
    ) {
      return (
        <div className="horizontal-list for-scroll-width row-list movies">
          <Loading size={80} showText={false} />
        </div>
      );
    }
    return null;
  };

  // Replace the old getAllVideoData function
  const getAllVideoData = (filterRows) => {
    loadInitialData(filterRows);
  };

  const handleLock = (val) => {
    setVlock(val);
    if (window.localStorage.getItem('btn-press') !== val) {
      if (window.document.getElementById('top-menu-0')) {
        window.document.getElementById('top-menu-0').classList.add('focused');
      }
    }
  };

  const handleUpdateUISection = () => {
    setUpdateUISection(!updateUISection);
  };

  const resetVerticalPagination = (d) => {
    setVerticalPagination((prev) => ({
      ...prev,
      currentPage: 0,
      itemsPerPage: 5,
      loadedRows: 0,
      totalRows: 0,
      isLoading: false,
      hasMore: true,
      currentBatchLoading: false,
      readyRows: [],
    }));

    handlePageChange(d);
    setIsError(false);
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [showFiltered]);

  useEffect(() => {
    setPageLoaded(false);
    getMenuDetails(activePage, abortSignal)
      .then(async (res) => {
        resetData();
        const menu = [];
        const menuPlaylists = {};
        if (res.content.playlists.length > 0) {
          setNoPlayList(res.content.playlists.length);
        } else {
          setPageLoaded(true);
        }

        res.content.playlists.length > 0 &&
          res.content.playlists.forEach((m) => {
            setNoPlayList(false);

            if (m.child_playlists) {
              menu.push({
                id: m._id,
                title: m.title,
                vastUrlroku: m.vast_url_roku,
                status: 'PENDING',
              });

              menuPlaylists[m._id] = {
                hasChildPlaylist: true,
                childPlaylists: [],
              };
              m.child_playlists.forEach((cp) => {
                if (
                  Number(cp.videos_count) > 0 ||
                  Number(cp.series_count) > 0
                ) {
                  menuPlaylists[m._id].childPlaylists.push({
                    id: cp._id,
                    title: cp.title,
                    videosCount: Number(cp.videos_count),
                    seriesCount: Number(cp.series_count),
                    type: cp.program_type,
                    vastUrlroku: cp.vast_url_roku,
                    status: 'PENDING',
                  });
                }
              });
            } else {
              if (Number(m.videos_count) > 0 || Number(m.series_count) > 0) {
                menu.push({
                  id: m._id,
                  title: m.title,
                  vastUrlroku: m.vast_url_roku,
                  status: 'PENDING',
                });
              }

              menuPlaylists[m._id] = {
                hasChildPlaylist: false,
                videosCount: Number(m.videos_count),
                seriesCount: Number(m.series_count),
                totalCount: Number(m.videos_count) + Number(m.series_count),
                type: m.program_type,
              };
            }
          });

        subMenuData.current = menu;
        dataSection.current.total = menu.length;
        videosData.current = menuPlaylists;
        setActiveSubPage(menu[0]?.id?.toString());
        filteredSubMenuData.current = menu.slice(
          uiSection.current.focused.rowIndex,
          uiSection.current.perPage
        );
        setTimeout(() => {
          getAllVideoData(menu);
        }, 200);
        setShowVideo(
          activePageLayout.bgVideo !== '' &&
          activePageLayout.layout === PAGE_LAYOUT.RAIL
        );
      })
      .catch((error) => {
        // Only handle non-abort errors
        if (error.name !== 'AbortError') {
          sentryException(error);
          setIsError(true);
          logger.error('Menu details error:', error);
        }
      });
  }, [activePage, vLock, abortSignal]);

  const handleMenuClick = (page) => {
    setSubPageLoaded(false);
    setActiveSubPage(page.toString());
    setTimeout(() => setSubPageLoaded(true), 250);
  };

  const goBackExit = () => {
    const getFocusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );
    getFocusedElements.forEach((e) => {
      window.document.getElementById(`${e.id}`).classList.remove('focused');
    });
    setPopUpOpen(!popUpOpen);
    if (popUpOpen) {
      if (window.document.getElementById('top-menu-0')) {
        window.document.getElementById('top-menu-0').classList.add('focused');
      }
    }
  };

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

  const handleVideoData = (moreD = []) => {
    setMoreData(moreD);
  };

  const handleShowDetailPage = (data) => {
    setShowDetailPage(false);
    setDetailPageData(data);

    setShowDetailPage(true);
  };
  const handleHideDetailPage = () => {
    setShowDetailPage(false);
    voiceSpeak(detailPageData?.title);
  };
  const handleOpenSeries = (data) => {
    setSeriesLoading(true);
    getEpisodes(activePage, data.activeSubPage, data.id, 1, 20, abortSignal)
      .then((res) => {
        const filteredData = res?.content?.filter(
          (item) => item.id === data.id
        );
        const seasons = filteredData[0]?.episodes
          .map((item) => item.season)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort();

        const result = {};

        for (let i = 0; i < seasons.length; i += 1) {
          const key = `Season: ${seasons[i]}`;
          const season = filteredData[0]?.episodes.filter(
            (s) => s.season === seasons[i]
          );
          result[key] = season;
        }
        const keyWiseObjects = Object.keys(result).map((key) => ({
          key,
          values: result[key],
        }));
        setSeriesData(filteredData[0]);
        setSeasonData(keyWiseObjects);
        setSeriesLoading(false);
        setSeriesId(data.activeSubPage);
        setSeriesVastRoku(data.vastRoku);
        setShowSeries(!showSeries);
      })
      .catch((error) => {
        // Only handle non-abort errors
        if (error.name !== 'AbortError') {
          setIsError(true);
          sentryException(error);
          logger.error('Episodes error:', error);
        }
        setSeriesLoading(false);
      });
  };

  const handlePlayerClose = () => {
    handleHideDetailPage();
  };

  const backHandler = () => {
    if (
      document
        .querySelector('.user-active .prj-element.focused')
        .classList.contains('link')
    ) {
      showExitApp();
      return;
    }
    document
      .querySelector('.user-active .prj-element.focused')
      ?.classList.remove('focused');
    document.querySelector('.menu-item.active').classList.add('focused');
    if (document.querySelector('.page-container.has-show-bg-video')) {
      document.querySelector(
        '.page-container.has-show-bg-video'
      ).style.marginTop = '790px';
    }
    if (document.querySelector('.page-container #vertical-scroll')) {
      document.querySelector(
        '.page-container #vertical-scroll'
      ).style.marginTop = '0px';
    }
  };

  const handleBack = () => {
    if (showDetailPage) {
      if (
        window.document.getElementById('bg-video-player') &&
        window.document.getElementById('bg-player')
      ) {
        videojs('bg-player').play();
      }
      handleHideDetailPage();
    } else {
      backHandler();
    }
  };

  const handleCloseSeries = () => {
    setShowSeries(!showSeries);
  };

  // Enhanced navigation with better focus management
  const handleRemoteKeys = (code) => {
    if (code === 'ArrowDown') {
      // Check if we need to load more rows
      const currentFocusIndex = addRowRef.current;
      const totalLoaded = verticalPagination.loadedRows;
      const bufferThreshold = 2; // Load more when user is 2 rows away from end

      if (
        currentFocusIndex >= totalLoaded - bufferThreshold &&
        verticalPagination.hasMore &&
        !verticalPagination.currentBatchLoading
      ) {
        loadMoreRows();
        return; // Don't navigate while loading
      }

      // Check if we can navigate to the next row
      const nextRowIndex = addRowRef.current + 1;
      const canNavigate = canNavigateToRow(nextRowIndex);

      if (canNavigate && addRowRef.current < dataSection.current.total - 1) {
        addRowRef.current += 1;
        // detectKey(code); // This line was commented out in the original file
      } else if (verticalPagination.currentBatchLoading) {
        // If batch is loading, don't allow navigation yet
      }
    } else if (code === 'ArrowUp') {
      if (addRowRef.current > 0) {
        addRowRef.current -= 1;
        // detectKey(code); // This line was commented out in the original file
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="hide"
        id="back-to-exit-page"
        onClick={() => goBackExit()}
      >
        back
      </button>

      {pageLoaded && showVideo && (
        <div className="live-video-container">
          <BgPlayer
            id="bg-player"
            source={activePageLayout.bgVideo}
            setShowVideo={setShowVideo}
          />
          <div className="bg-player-overlay-opacity" />
        </div>
      )}
      <Main>
        <div
          className="view-container view user-active"
          id={`page-${activePage}`}
        >
          <button
            type="button"
            className="hide"
            id="focus-down-btn"
            onClick={() => handleRemoteKeys('ArrowDown')}
          >
            down
          </button>
          <button
            type="button"
            className="hide"
            id="focus-up-btn"
            onClick={() => handleRemoteKeys('ArrowUp')}
          >
            up
          </button>
          <TopMenu
            menuData={menuData}
            activePage={activePage}
            handlePageChange={resetVerticalPagination}
            activePageLayoutType={activePageLayout.layout}
          />
          <div
            className={
              showVideo
                ? 'page-container content-container has-show-bg-video'
                : 'page-container content-container main-no-video-show'
            }
            id="page-container-main"
            role="none"
          >
            {!pageLoaded && (!isMenuError || isError) && (
              <Loading
                showVideo={showVideo}
                page="home-page-loader"
                size={80}
                showText={false}
              />
            )}
            {pageLoaded && noPlaylist === 0 && (
              <div className="horizontal-no-data no-data-available">
                {' '}
                <NoDataFound />{' '}
              </div>
            )}
            {(isMenuError || isError) && (
              <NoDataFound message="Failed to load data" />
            )}
            {pageLoaded && (
              <>
                {activePageLayout.layout === PAGE_LAYOUT.GRID && (
                  <>
                    <div className="side-menu">
                      <SideMenu
                        subMenuData={subMenuData.current}
                        activeSubPage={activeSubPage}
                        handleMenuClick={handleMenuClick}
                      />
                    </div>
                    {!subPageLoaded && (
                      <div className="gridLoader">
                        <Loading size={80} showText={false} />
                      </div>
                    )}

                    {subPageLoaded && (
                      <div
                        className="page-content content-container with-header"
                        id="page-content"
                      >
                        {!videosData.current[Number(activeSubPage)]
                          ?.hasChildPlaylist && (
                            <Grid
                              id={Number(activeSubPage)}
                              containerId={`grid-${activeSubPage}`}
                              videosCount={
                                videosData.current[Number(activeSubPage)]
                                  ?.videosCount
                              }
                              type={
                                videosData.current[Number(activeSubPage)]?.type
                              }
                              activePage={activePage}
                              activeSubPage={activeSubPage}
                              keyUpElement=".top-navigation .prj-element.active"
                              keyDownElement={`grid-${Number(activeSubPage) + 1}`}
                            />
                          )}

                        {videosData[Number(activeSubPage)]
                          ?.hasChildPlaylist && (
                            <div
                              className="grid-page-content home-normal-rows"
                              id="page-content"
                            >
                              <div
                                className="vertical-scroll grid-list has-child-play-list"
                                id="vertical-scroll"
                              >
                                {/* <div
                                className="grid-list has-child-play-list"
                                id={`grid-${activeSubPage}`}
                              > */}

                                {videosData.current[
                                  Number(activeSubPage)
                                ].childPlaylists.map((cpd, idx) => (
                                  <HorizontalList
                                    id={cpd.id}
                                    title={cpd.title}
                                    containerId={`hl-${idx}`}
                                    videosCount={
                                      videosData.current[cpd.id]?.videosCount
                                    }
                                    type={videosData.current[cpd.id]?.type}
                                    activePage={activePage}
                                    activeSubPage={`${cpd.id}`}
                                    key={`hl${cpd.id}`}
                                    keyUpElement={
                                      idx === 0
                                        ? '.top-navigation .prj-element.active'
                                        : `#hl-${idx - 1} .prj-element`
                                    }
                                    keyDownElement={
                                      idx + 1 ===
                                        videosData.current[Number(activeSubPage)]
                                          .childPlaylists.length
                                        ? ''
                                        : `#hl-${idx + 1} .prj-element`
                                    }
                                    setActiveDetId={setActiveDetId}
                                    handleVideoData={handleVideoData}
                                    handleHideDetailPage={handleHideDetailPage}
                                    handleShowDetailPage={handleShowDetailPage}
                                    handleOpenSeries={handleOpenSeries}
                                    vastUrlRoku={cpd.vastUrlroku}
                                    handleLock={handleLock}
                                    trailerUrl={cpd.trailerUrl}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}

                {activePageLayout.layout === PAGE_LAYOUT.RAIL && (
                  <div
                    className={`page-content home-normal-rows ${showVideo ? 'has-bg-video' : ''}`}
                    id="page-content"
                  >
                    <div className="vertical-scroll" id="vertical-scroll">
                      <div
                        style={{
                          height: `${uiSection.current.marginAdjust[uiSection.current.removerows]}px`,
                          width: `100%`,
                          clear: `both`,
                        }}
                      />
                      <div
                        style={{
                          height: isLoading
                            ? `${slicedRowHeight.current}px`
                            : '0',
                          width: `100%`,
                          clear: `both`,
                        }}
                      />
                      {showFiltered.map((smd, idx) => {
                        let horizontalListIndex = idx;
                        if (addRowRef.current > 0) {
                          horizontalListIndex =
                            uiSection.current.removerows + idx;
                        }

                        return (
                          <HorizontalList
                            id={smd.id}
                            title={smd.title}
                            containerId={`hl${horizontalListIndex}`}
                            videosCount={
                              videosData.current[smd.id]?.videosCount
                            }
                            type={videosData.current[smd.id]?.type}
                            activePage={activePage}
                            activeSubPage={`${smd.id}`}
                            key={`hl${smd.id}`}
                            keyUpElement={
                              idx === 0
                                ? '.top-navigation .prj-element.active'
                                : `#hl${horizontalListIndex - 1} .prj-element`
                            }
                            keyDownElement={
                              idx + 1 === showFiltered.length
                                ? ''
                                : `#hl${horizontalListIndex + 1} .prj-element`
                            }
                            handleHideDetailPage={handleHideDetailPage}
                            handleShowDetailPage={handleShowDetailPage}
                            setActiveDetId={setActiveDetId}
                            handleVideoData={handleVideoData}
                            handleOpenSeries={handleOpenSeries}
                            vastUrlRoku={smd.vastUrlroku}
                            handleLock={handleLock}
                            trailerUrl={smd.trailerUrl}
                            perPageRows={uiSection.current.perPage}
                            activeRow={1}
                            menuVideoDataList={menuVideoDataList.current}
                            apiCalled={apiDataCalled.current}
                            handleApiCall={(v) => {
                              apiDataCalled.current = v;
                            }}
                            subMenuData={subMenuData}
                            uiSection={uiSection.current}
                            rowId={idx}
                            addRowRef={addRowRef.current}
                            dataSection={dataSection}
                            videosList={
                              menuVideoDataList.current[smd.id]?.data?.[1] || []
                            }
                            handleUpdateUISection={handleUpdateUISection}
                            isRowReady={isRowReady}
                          />
                        );
                      })}
                      {/* Show loading indicator when batch is loading */}
                      {renderLoadingIndicator()}
                    </div>
                    &nbsp;
                  </div>
                )}
              </>
            )}
          </div>
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
          <NavigateBack onBack={handleBack} />
        </div>
        {showDetailPage && SHOW_DETAIL_PAGE && (
          <Suspense>
            <DetailPage
              detailPageData={detailPageData}
              portrait={detailPageData.isPortrait}
              posterH={detailPageData.posterH}
              posterV={detailPageData.posterV}
              handleHideDetailPage={handleHideDetailPage}
              videos={moreData}
              containerIdPrefix={`item${detId}v`}
              setShowDetailPage={setShowDetailPage}
              handleBack={handleBack}
            />
          </Suspense>
        )}

        {showDetailPage && !SHOW_DETAIL_PAGE && (
          <Suspense>
            <Player
              id="player"
              videoData={detailPageData}
              resumeFrom={0}
              handlePlayerClose={handlePlayerClose}
              setShowDetailPage={setShowDetailPage}
              isTrailer={false}
            />
          </Suspense>
        )}

        {seriesLoading && (
          <div className="series-loading">
            <Loading size={80} showText={false} />
          </div>
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
      </Main>

      {showAgeVerification && (
        <AgeVerificationPrompt
          onVerified={handleAgeVerificationYes}
          onReject={handleAgeVerificationNo}
        />
      )}
    </>
  );
};

Home.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePage: PropTypes.string.isRequired,
  activePageLayout: PropTypes.shape({
    layout: PropTypes.string,
    bgVideo: PropTypes.string,
  }).isRequired,
  handlePageChange: PropTypes.func.isRequired,
  abortSignal: PropTypes.object,
  isMenuError: PropTypes.bool,
};

export default Home;
