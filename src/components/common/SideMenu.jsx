/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import voiceSpeak from '../../utils/accessibility.util';

const SideMenu = ({
  subMenuData = [],
  activeSubPage,
  handleMenuClick,
  isSettingsPage = false,
}) => {
  const subMenuDataLength = subMenuData.length;

  const mouseHover = (idx) => {
    Array.from(document.querySelectorAll('.prj-element.focused')).forEach(
      (el) => {
        el.classList.remove('focused');
      }
    );

    window.document.getElementById(idx).classList.add('focused');
  };

  const getItemId = (item) => {
    if (typeof item === 'string') {
      return item;
    }
    return item.id || item.title || item;
  };

  const getItemTitle = (item) => {
    if (typeof item === 'string') {
      return item;
    }
    return item.title || item;
  };

  const isItemActive = (item) => {
    if (!isSettingsPage) {
      const itemId = getItemId(item);
      return activeSubPage === itemId.toString();
    }
    return false;
  };

  const handleOnMenuFocus = (title) => {
    voiceSpeak(title);
  }

  return (
    <div className="side-nav">
      {subMenuData.map((item, idx) => (
        <>
          <a
            id={`side-menu-${idx}`}
            className={
              !isSettingsPage
                ? `link prj-element ${isItemActive(item) ? 'active focused' : ''}`
                : 'link prj-element active'
            }
            key={`sub-menu-${getItemId(item)}`}
            aria-hidden
            onClick={() => handleMenuClick(item)}
            data-focus-left={false}
            data-focus-right={
              !isSettingsPage ? '.page-content .prj-element' : '#toggleSwitch'
            }
            data-focus-up={
              idx === 0
                ? '.top-navigation .prj-element.active'
                : `#side-menu-${idx - 1}`
            }
            data-focus-down={
              idx + 1 === subMenuDataLength ? false : `#side-menu-${idx + 1}`
            }
            data-focus-in={`#side-menu-${idx}-focus-in`}
            onMouseEnter={() => mouseHover(`side-menu-${idx}`)}
          >
            <span>{getItemTitle(item)}</span>
          </a>
          <button
            className="hide"
            type="button"
            id={`side-menu-${idx}-focus-in`}
            onClick={() => handleOnMenuFocus(item.title)}
          >
            Focus In
          </button>
        </>
      ))
      }
    </div >
  );
};

SideMenu.propTypes = {
  subMenuData: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        type: PropTypes.string,
        data: PropTypes.object,
      }),
    ])
  ).isRequired,
  activeSubPage: PropTypes.string.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  isSettingsPage: PropTypes.bool.isRequired,
};

export default SideMenu;
