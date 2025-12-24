// import APP_CONFIG from '../config/app.config';

import APP_CONFIG from '../config/app.config';

const handleRowListScroll = (
  id,
  defaultFocus = APP_CONFIG.ROWLIST_CURRENT_SCROLL_BEHAVIOR
) => {
  const focusedElement = window.document.querySelector(
    `#${id} .prj-element.focused`
  );
  const focusedRow = window.document.querySelector(`#vertical-scroll #${id}`);
  const rowScrollElement = window.document.getElementById(`${id}-row-scroll`);
  // const gridScrollElement = window.document.getElementById('vertical-scroll');
  const gridScrollElement = window.document.querySelector(
    '.user-active #vertical-scroll'
  );

  if (focusedRow && gridScrollElement) {
    const marginOffset = focusedRow.offsetTop;
    gridScrollElement.style.marginTop = `${-marginOffset}px`;
  }
  if (focusedElement && rowScrollElement) {
    // for fixed focus on left side
    if (defaultFocus === 'fixed-first') {
      if (focusedElement.offsetLeft > 0) {
        rowScrollElement.style.marginLeft = `-${focusedElement.offsetLeft}px`;
      } else {
        rowScrollElement.style.marginLeft = 0;
      }
    }

    // floating focus
    if (defaultFocus === 'floating') {
      const rowRect = focusedRow?.getBoundingClientRect() || {
        left: 0,
        right: window.innerWidth,
      };
      if (
        focusedElement &&
        (focusedElement.getClientRects()[0].left < rowRect.left ||
          focusedElement.getClientRects()[0].right > rowRect.right)
      ) {
        if (focusedElement.getClientRects()[0].right > rowRect.right) {
          rowScrollElement.style.marginLeft = `${
            Number(rowScrollElement.style.marginLeft.split('p')[0] || 0) -
            // (focusedElement.getClientRects()[0].right - window.innerWidth) -
            focusedElement.offsetWidth -
            Number(
              getComputedStyle(
                window.document.querySelector('.focused')
              ).marginRight.split('p')[0] || 0
            )
          }px`;
        } else if (focusedElement.getClientRects()[0].left < rowRect.left) {
          rowScrollElement.style.marginLeft = `-${focusedElement.offsetLeft}px`;
        } else if (focusedElement.offsetLeft < rowRect.left) {
          rowScrollElement.style.marginLeft = rowRect.left;
        }
      }
    }
  }
};

export default handleRowListScroll;
