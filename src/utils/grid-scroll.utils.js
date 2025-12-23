import APP_CONFIG from '../config/app.config';

const handleGridScroll = (
  defaultFocus = APP_CONFIG.GRID_CURRENT_SCROLL_BEHAVIOR
) => {
  const focusedElement = window.document.querySelector(
    '.grid .prj-element.focused'
  );
  const gridScrollElement = window.document.querySelector('.grid');

  const gridElement = window.document.getElementById('vertical-scroll');

  if (focusedElement && gridScrollElement) {
    // fixed focus for first row
    if (defaultFocus === 'fixed-top')
      gridScrollElement.style.marginTop = `-${focusedElement.offsetTop}px`;
    // floating focus
    if (defaultFocus === 'floating') {
      if (
        focusedElement.getClientRects()[0].bottom >
          gridElement.getClientRects()[0].bottom ||
        focusedElement.getClientRects()[0].top <=
          gridElement.getClientRects()[0].top
      ) {
        if (
          focusedElement.getClientRects()[0].bottom >
          gridElement.getClientRects()[0].bottom
        ) {
          gridScrollElement.style.marginTop = `${
            Number(gridScrollElement.style.marginTop.split('p')[0] || 0) -
            focusedElement.offsetHeight -
            Number(
              getComputedStyle(
                window.document.querySelector('.focused')
              ).marginBottom.split('p')[0] || 0
            )
          }px`;
        } else if (
          focusedElement.getClientRects()[0].top <=
          gridElement.getClientRects()[0].top
        ) {
          gridScrollElement.style.marginTop = `-${focusedElement.offsetTop}px`;
        }
      }
    }
  }
};

export default handleGridScroll;
