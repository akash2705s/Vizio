/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import APP_CONFIG, { APP_PAGES, PAGE_LAYOUT } from '../config/app.config';
import '../utils/focus-handle.util';
import { getMainMenuData, getSettingData } from '../services/api.service';
import '../assets/styles/chota.css';
import '../assets/styles/styles.css';
import { getBrowserVersion, logger } from '../utils/helper.util';
import { getLocalValue, setLocalValue } from '../utils/local-cache.util';
import { useSettings } from '../context/SettingsContext';
import useAbortController from '../hooks/useAbortController';
import { sentryException } from '../utils/sentry-logger.util';
import { VizioInfoProvider } from '../context/VizioInfoContext';

const SplashView = lazy(() => import('../views/splash.view'));
const Home = lazy(() => import('../views/Home'));
const Search = lazy(() => import('../views/Search'));
const Settings = lazy(() => import('../views/Settings'));

// Render the view
const AppRoutes = () => {
  const [appLoaded, setAppLoaded] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [pageLayouts, setPageLayouts] = useState({
    layout: PAGE_LAYOUT.GRID,
    bgVideo: '',
  });
  const [activePage, setActivePage] = useState('');
  const [activePageLayout, setActivePageLayout] = useState({
    layout: PAGE_LAYOUT.GRID,
    bgVideo: '',
  });
  const [isError, setIsError] = useState(false);
  const deviceId = getLocalValue(APP_CONFIG.REGISTRY.DEVICE_ID, null);
  let newDeviceId = null;

  const timerRef = useRef(null);
  const counter = useRef(0);
  const timeout = getBrowserVersion() >= 53 ? 300 : 120;

  const { setSettings } = useSettings();
  const { createAbortController, abortCurrentRequests, getSignal } =
    useAbortController();

  const navigateTo = (page) => {
    abortCurrentRequests();

    createAbortController();

    if (pageLayouts[Number(page)]) {
      setActivePageLayout(pageLayouts[Number(page)]);
    } else if (page === APP_PAGES.HOME) {
      if (menuData.length === 0) return;
      setActivePage(menuData[0].id.toString());
      setActivePageLayout(pageLayouts[menuData[0].id]);
      return;
    } else {
      setActivePageLayout(PAGE_LAYOUT.GRID);
    }

    setActivePage(page.toString());
  };

  const settingAPI = (url) => {
    getSettingData(`${url}/config`, getSignal())
      .then((res) => {
        setSettings(res);
      })
      .catch((error) => {
        setIsError(true);
        if (error.name !== 'AbortError') {
          logger.error('Settings API error:', error);
        }
      });
  };

  const handleGetMainMenuData = () => {
    getMainMenuData(getSignal())
      .then((res) => {
        const menu = [];
        const layouts = {};
        res.content.top_menus.forEach((m) => {
          if (m.is_live_channel) return;
          menu.push({
            // eslint-disable-next-line no-underscore-dangle
            id: m._id,
            title: m.title,
          });

          layouts[m._id] = {
            layout: m.playlist_layout,
            bgVideo: '',
          };
          if (
            Number(m.live_video_in_background) === 1 &&
            m.live_video_link !== ''
          ) {
            layouts[m._id].bgVideo = m.live_video_link;
          }
        });

        setMenuData(menu);
        setPageLayouts(layouts);
        setActivePage(menu[0].id.toString());
        setActivePageLayout(layouts[menu[0].id]);
        setTimeout(() => {
          setAppLoaded(true);
        }, 5000);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          sentryException(error);
          setIsError(true);
          logger.error('Menu data fetch error:', error);
        }
      });
  };

  const getDeviceId = async () => {
    newDeviceId = 0;
    // console.log('In main else newDeviceId***', newDeviceId);
    setLocalValue(APP_CONFIG.REGISTRY.DEVICE_ID, newDeviceId);
    handleGetMainMenuData();
  };

  useEffect(() => {
    createAbortController();

    document.documentElement.style.setProperty(
      '--theme-color-primary',
      process.env.REACT_APP_BASE_PRIMARY_COLOR
    );
    document.documentElement.style.setProperty(
      '--theme-color-button',
      process.env.REACT_APP_WHITE_OVERRIDE || '#ffffff'
    );
    const APP_PRIMARY_COLOR_RGB = () => {
      const hex = process.env.REACT_APP_BASE_PRIMARY_COLOR.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    };
    document.documentElement.style.setProperty(
      '--primary-color-rgb',
      APP_PRIMARY_COLOR_RGB() || '255, 173, 29'
    );

    try {
      if (process.env.REACT_APP_PLATFORM !== 'WEB') {
        timerRef.current = setInterval(() => {
          if (counter.current <= timeout) {
            counter.current += 1;
          } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (counter.current > timeout) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }, 1000);
      }
    } catch (error) {
      logger.log(error, 'error');
    }

    // Initialise global variable of app
    window.CB = {
      platform: process.env.REACT_APP_PLATFORM,
      fromAccountPage: false,
      refreshView: false,
      activeFeaturedContentIndex: 0,
      activeFeaturedItemIndex: 0,
      currentVideoDetail: {
        currentVideoProgress: 0,
        currentVideoSeen: false,
      },
      channelBase: '',
      menuFlag: false,
    };

    window.CB.channelBase = process.env.REACT_APP_CHANNEL_DATA_JSON;
    settingAPI(process.env.REACT_APP_CHANNEL_DATA_JSON);
    window.CB.apiVersion = process.env.REACT_APP_API_VERSION || '/roku_json_v5';
    if (deviceId) {
      handleGetMainMenuData();
    } else {
      getDeviceId();
    }

    return () => {
      delete window.CB;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      abortCurrentRequests();
    };
  }, []);

  if (!appLoaded && !isError) {
    return (
      <Suspense>
        <SplashView />
      </Suspense>
    );
  }

  switch (activePage) {
    case APP_PAGES.SEARCH:
      return (
        <Suspense>
          <Search
            menuData={menuData}
            activePage={activePage}
            handlePageChange={navigateTo}
            abortSignal={getSignal()}
          />
        </Suspense>
      );

    case APP_PAGES.SETTINGS:
      return (
        <Suspense>
          <Settings
            menuData={menuData}
            activePage={activePage}
            handlePageChange={navigateTo}
            abortSignal={getSignal()}
          />
        </Suspense>
      );

    default:
      return (
        <VizioInfoProvider>
          <Suspense>
            <Home
              menuData={menuData}
              activePage={activePage}
              activePageLayout={activePageLayout}
              handlePageChange={navigateTo}
              abortSignal={getSignal()}
              isMenuError={isError}
            />
          </Suspense>
        </VizioInfoProvider>
      );
  }
};

export default AppRoutes;
