import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import TopMenu from '../components/common/TopMenu';
import ExitPrompt from '../components/prompts/exit-prompt.component';

const Main = ({
  // menuData,
  // activePage,
  // handlePageChange,
  children,
  // activePageLayoutType,
}) => {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const toggleExitConfirmation = () => {
    setShowExitConfirmation(!showExitConfirmation);
  };
  return (
    <div className="app-container layout">
      {/* <TopMenu
        menuData={menuData}
        activePage={activePage}
        handlePageChange={handlePageChange}
        activePageLayoutType={activePageLayoutType}
      /> */}

      {children}
      {showExitConfirmation && <ExitPrompt />}
      <button
        type="button"
        className="app-exit-confirmation hide"
        onClick={toggleExitConfirmation}
      >
        ShowExitConfirmation
      </button>
    </div>
  );
};

Main.propTypes = {
  // menuData: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.number,
  //     title: PropTypes.string,
  //   })
  // ).isRequired,
  // activePage: PropTypes.string.isRequired,
  // handlePageChange: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  // activePageLayoutType: PropTypes.string.isRequired,
};

export default Main;
