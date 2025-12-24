/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SideMenu from '../components/common/SideMenu';
import MainLayout from '../layout/main.layout';
import TopMenu from '../components/common/TopMenu';
import NavigateBack from '../components/common/navigate-back.component';
import showExitApp from '../utils/app-exist.util';
import { useSettings } from '../context/SettingsContext';
import APP_CONFIG from '../config/app.config';

const Settings = ({ menuData, activePage, handlePageChange }) => {
  const [settingsTitle, setSettingsTitle] = useState([]);
  const [settingsView, setSettingsView] = useState('');
  const [currentLegalPage, setCurrentLegalPage] = useState(null);

  const { settings } = useSettings();

  const extractTitles = (data) => {
    const result = [];
    const obj = data[0];

    if (obj.legal_pages?.length > 0) {
      obj.legal_pages.forEach((page) => {
        if (page.Title) {
          result.push({
            id: `legal-${page._id}`,
            title: page.Title,
            type: 'legal',
            data: page,
          });
        }
      });
    }

    return result;
  };

  const determineViewType = (data) => {
    if (data.length === 0) return null;
    const obj = data[0];
    const hasBrd = false;
    const hasLegal = obj?.legal_pages?.length > 0;

    if (hasBrd) return 'brd';
    if (hasLegal) return `legal-${obj.legal_pages[0]._id}`;
    return null;
  };

  const handleMenuClick = (menuItem) => {
    if (typeof menuItem === 'string') {
      setSettingsView('legal');
    } else {
      setSettingsView(menuItem.id);
      if (menuItem.type === 'legal') {
        setCurrentLegalPage(menuItem.data);
      }
    }
  };

  useEffect(() => {
    const titles = extractTitles(settings?.settings || []);
    setSettingsTitle(titles);

    const viewType = determineViewType(settings?.settings || []);
    setSettingsView(viewType);

    if (viewType && viewType.startsWith('legal-')) {
      const legalPage = titles.find((item) => item.id === viewType);
      if (legalPage) {
        setCurrentLegalPage(legalPage.data);
      }
    }
  }, [settings]);

  const isSettings = true;
  const handleBack = () => {
    showExitApp();
  }

  // Render Legal view
  const renderLegalView = () => {
    if (!currentLegalPage) return null;

    return (
      <div className="settings-qrcode-container legal">
        <div className="settings-legal-container">
          {currentLegalPage.ImageUrl && 
          <img
            className="qr-code-image"
            src={currentLegalPage.ImageUrl}
            alt="QRcode"
          />
          }
          <div className="settings-text">
            <span className="settings-description">
              {currentLegalPage.Description}
            </span>
            <span className="settings-url">{currentLegalPage.Url}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render no content view
  const renderNoContentView = () => (
    <div className="settings-qrcode-container">
      <div className="no-content-message">
        <h3>No Settings Available</h3>
        <p>There are no settings to display at this time.</p>
      </div>
    </div>
  );

  return (
    <MainLayout
      menuData={menuData}
      activePage={activePage}
      handlePageChange={handlePageChange}
    >
      <div
        className="page-container settings-page view-container view user-active"
        id="settings-page"
      >
        <TopMenu
          menuData={menuData}
          activePage={activePage}
          handlePageChange={handlePageChange}
        />

        <div className="side-menu settings-view">
          <SideMenu
            isSettingsPage={isSettings}
            subMenuData={settingsTitle}
            activeSubPage={settingsView}
            handleMenuClick={handleMenuClick}
          />
        </div>

        {settingsView && settingsView.startsWith('legal-') && renderLegalView()}
        {!settingsView && settingsTitle.length === 0 && renderNoContentView()}
        <div id="display-version">V - {APP_CONFIG.VERSION}</div>

        <NavigateBack onBack={handleBack} />
      </div>
    </MainLayout>
  );
};
Settings.propTypes = {
  menuData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activePage: PropTypes.string.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};
export default Settings;
