/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { APP_PAGES } from '../../config/app.config';
import logoImg from '../../assets/images/logo.png';
import searchIcon from '../../assets/images/icons/search.png';
import settingsIcon from '../../assets/images/icons/settings.png';
import { useSettings } from '../../context/SettingsContext';
import voiceSpeak from '../../utils/accessibility.util';
// import scrollAppView from '../../utils/viewScroll.util';

const TopMenu = ({
  menuData,
  activePage,
  handlePageChange,
  activePageLayoutType,
}) => {
  const appName = process.env.REACT_APP_NAME;
  const menuDataLength = menuData.length;
  // console.log('TOP MENU');
  const { settings } = useSettings();

  const isSettingsAvailable = () =>
    Array.isArray(settings?.settings) &&
    settings.settings.length > 0 &&
    settings.settings[0] !== null &&
    typeof settings.settings[0] === 'object' &&
    Object.keys(settings.settings[0]).length > 0 &&
    settings.settings[0].legal_pages;

  const navBarScroll = () => {
    const focusedElements = window.document.querySelector(
      '.user-active .prj-element.focused'
    );
    // const activeTab = focusedElements[0].id;
    if (focusedElements) {
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
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleScroll = () => {
    // console.log('focused top-menu-0****');

    const focusedElements = window.document.querySelectorAll(
      '.prj-element.focused'
    );

    if (focusedElements.length > 0) {
      // scrollAppView(focusedElements[0]);
      if (
        // window.document.querySelector('.live-video-container') &&
        activePageLayoutType !== 'grid' &&
        activePage !== 'search'
      ) {
        if (focusedElements[0].id === 'top-menu-0') {
          // console.log('focused top-menu-0', focusedElements);

          if (window.document.querySelector('.live-video-container')) {
            if (window.document.querySelectorAll('.page-container')) {
              window.document.querySelectorAll(
                '.page-container'
              )[0].style.marginTop = `788px`;
            }
            if (
              window.document.querySelectorAll(
                '.page-container .page-content.has-bg-video'
              )
            ) {
              window.document.querySelectorAll(
                '.page-container .page-content.has-bg-video'
              )[0].style.marginTop = '5px';
            }
          }
        }
      }
    }
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

    // handleFocusIn();
    // if (focusedElements.length > 0) {
    //   scrollAppView(focusedElements[0], 'center');
    // }
  };

  // Handle menu item click with abort functionality
  const handleMenuClick = (itemId) => {
    // Only proceed if the clicked item is different from the current active page
    if (activePage !== itemId.toString()) {
      // This will trigger the abort functionality in the parent component
      handlePageChange(itemId);
      navBarScroll();
    }
  };

  const handleOnMenuFocus = (title) => {
    voiceSpeak(`${title} menu`);
  };

  useEffect(() => {
    if (!window.CB.menuFlag) {
      window.CB.menuFlag = true;
      handleOnMenuFocus(menuData[0]?.title)
    }
  }, [])

  return (
    <nav className="nav top-navigation app-header" id="top-navigation">
      {/* <button
        type="button"
        className="hide"
        id="top-bar-tabs"
        onClick={handleScroll}
      >
        Scroll
      </button> */}
      <div className="nav-left menu-links">
        <a className="link brand-logo">
          <img src={logoImg} alt={appName} />
        </a>
        <div
          className="tabs"
          onClick={() => navBarScroll()}
          role="none"
          id="top-bar-tabs"
        >
          {menuData.map((item, idx) => (
            <>
              <a
                id={`top-menu-${idx}`}
                className={`link menu-item prj-element ${activePage === item.id.toString() ? 'first active focused' : ''}`}
                key={`menu-${item.id}`}
                aria-hidden
                onClick={() => handleMenuClick(item.id)}
                data-focus-left={idx === 0 ? false : `#top-menu-${idx - 1}`}
                data-focus-right={
                  idx + 1 === menuDataLength
                    ? '#top-menu-search'
                    : `#top-menu-${idx + 1}`
                }
                data-focus-up={false}
                // data-focus-down=".content-container .prj-element"
                data-focus-down={
                  activePage === APP_PAGES.SEARCH
                    ? '#custom-keyboard-textbox'
                    : activePage === APP_PAGES.SETTINGS
                      ? '.side-nav .prj-element'
                      : '.content-container .prj-element'
                }
                onMouseEnter={() => mouseHover(`top-menu-${idx}`)}
                data-on-self-focus="#top-bar-tabs"
                data-focus-in={`#top-menu-${idx}-focus-in`}
              >
                {item.title}
              </a>
              <button
                className="hide"
                type="button"
                id={`top-menu-${idx}-focus-in`}
                onClick={() => handleOnMenuFocus(item.title)}
              >
                Focus In
              </button>
            </>
          ))}
        </div>
      </div>
      <div className="nav-right-container">
        <div className="nav-right">
          <a
            id="top-menu-search"
            className={`link icon prj-element ${activePage === APP_PAGES.SEARCH ? 'active focused' : ''
              }`}
            aria-hidden
            onClick={() => handleMenuClick(APP_PAGES.SEARCH)}
            data-focus-left={`#top-menu-${menuDataLength - 1}`}
            data-focus-right={
              isSettingsAvailable() ? '#top-menu-settings' : false
            }
            data-focus-up={false}
            data-focus-down={
              activePage === APP_PAGES.SEARCH
                ? '#custom-keyboard-textbox'
                : activePageLayoutType === 'grid' ||
                  activePage === APP_PAGES.SETTINGS
                  ? '.side-nav .prj-element'
                  : '.content-container .prj-element'
            }
            data-on-self-focus="#top-bar-tabs"
            data-focus-in="#top-menu-search-focus-in"
            onMouseEnter={() => mouseHover('top-menu-search')}
          >
            <img src={searchIcon} alt="Search" />
          </a>
          <button
            className="hide"
            type="button"
            id="top-menu-search-focus-in"
            onClick={() => handleOnMenuFocus("Search")}
          >
            Focus In
          </button>
        </div>
        {isSettingsAvailable() && (
          <div className="nav-right">
            <a
              id="top-menu-settings"
              className={`link icon prj-element ${activePage === APP_PAGES.SETTINGS ? 'active focused' : ''
                }`}
              aria-hidden
              onClick={() => handleMenuClick(APP_PAGES.SETTINGS)}
              data-focus-left="#top-menu-search"
              data-focus-right={false}
              data-focus-up={false}
              data-focus-down={
                activePageLayoutType === 'grid' ||
                  activePage === APP_PAGES.SETTINGS
                  ? '.side-nav .prj-element'
                  : '.content-container .prj-element'
              }
              data-on-self-focus="#top-bar-tabs"
              data-focus-in="#top-menu-settings-focus-in"
              onMouseEnter={() => mouseHover('top-menu-settings')}
            >
              <img src={settingsIcon} alt="Settings" />
            </a>
            <button
              className="hide"
              type="button"
              id="top-menu-settings-focus-in"
              onClick={() => handleOnMenuFocus("Settings")}
            >
              Focus In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

TopMenu.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePage: PropTypes.string.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  activePageLayoutType: PropTypes.string.isRequired,
};

export default TopMenu;
