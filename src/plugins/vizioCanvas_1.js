/* eslint-disable */

export function getFocusSnapshot(label = '') {
  const el = document.activeElement;

  const snapshot = {
    label,
    time: new Date().toISOString(),
    tag: el?.tagName,
    id: el?.id || null,
    class: el?.className || null,
    text: el?.innerText?.slice(0, 40) || null,
    isBody: el === document.body,
    isHtml: el === document.documentElement,
  };

  console.table(snapshot);
  return snapshot;
}

// Module-level state for tracking banner triggers
let previousTime = 0;
const shownBanners = new Set();

// Session storage key for persisting shown banners across video changes
const STORAGE_KEY = 'vizio_canvas_shown_banners';

// Load shown banners from sessionStorage
const loadShownBanners = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const bannerTimes = JSON.parse(stored);
      bannerTimes.forEach((time) => shownBanners.add(time));
    }
  } catch (e) {
    console.error('Error loading shown banners from sessionStorage:', e);
  }
};

// Save shown banners to sessionStorage
const saveShownBanners = () => {
  try {
    const bannerTimes = Array.from(shownBanners);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bannerTimes));
  } catch (e) {
    console.error('Error saving shown banners to sessionStorage:', e);
  }
};

// Banner configuration: [timeThreshold, adIndex, impIndex, engIndex, displayDurationMs]
const BANNER_CONFIGS = [
  [180, 0, 0, 0, 20000], // First banner at 180s (3min), shows for 4 seconds after button click
  [1800, 2, 2, 2, 20000], // Second banner at 540s (9min), shows for 5 seconds after button click
  [2700, 1, 1, 1, 20000], // Third banner at 720s (12min), shows for 5 seconds after button click
];

// Reset function to clear banner state (call when starting a new video)
// Note: This only resets the current session state, not sessionStorage
// To fully reset, use resetBannerState(true)
export const resetBannerState = (clearStorage = false) => {
  previousTime = 0;
  shownBanners.clear();
  if (clearStorage) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing shown banners from sessionStorage:', e);
    }
  } else {
    // Load existing shown banners from storage
    loadShownBanners();
  }
};

export const createTrappedDiv = (parentElement, player, currentTime) => {
  if (!parentElement) return;

  // Only one overlay at a time
  if (document.querySelector('[id^="trapped-overlay-div"]')) return;

  // Check if any banner threshold was crossed
  let triggeredBanner = null;
  for (const [bannerTime, adIndex, impIndex, engIndex, displayDuration] of BANNER_CONFIGS) {
    // Skip if already shown
    if (shownBanners.has(bannerTime)) continue;

    if (currentTime >= bannerTime) {
      triggeredBanner = { bannerTime, adIndex, impIndex, engIndex, displayDuration };
      shownBanners.add(bannerTime);
      saveShownBanners(); // Persist to sessionStorage
      break;
    }
  }

  // Update previousTime for next call
  previousTime = currentTime;

  // Exit if no banner should trigger
  if (!triggeredBanner) return;

  const uniqueId =
    'trapped-overlay-div-' +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2);

  let overlayActive = true;

  const childDiv = document.createElement('div');
  childDiv.id = uniqueId;
  childDiv.tabIndex = 0;

  Object.assign(childDiv.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'transparent',
    zIndex: '99999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // Hide player UI while Canvas popup is visible
  const playerOverlay = document.getElementById('player-overlay');
  const previousPlayerOverlayDisplay = playerOverlay
    ? playerOverlay.style.display || 'none'
    : 'none';
  if (playerOverlay) {
    playerOverlay.style.display = 'none';
  }

  const ads_list = [
    `<div id="l-banner-host" class="lb-banner-host lb-visible" aria-live="polite" style="position:fixed;right:24px;bottom:24px;width:auto;height:auto;pointer-events:none;z-index:9999;"><div id="corner-banner-poll-state" class="corner-banner-poll-container" style="width:720px;max-width:95vw;display:flex;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);transition:opacity 0.5s,transform 0.5s;"><div class="corner-banner-poll" style="background:rgba(0,0,0,0.6);border-radius:16px;padding:3rem 3.5rem;width:100%;max-width:850px;display:flex;flex-direction:column;gap:2rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><img src="https://raw.githubusercontent.com/akash768145s/img/main/hello.png" alt="Holiday kitchen hero" style="width:100%;height:auto;max-height:360px;object-fit:cover;border-radius:12px;margin-bottom:1.75rem;"><h3 style="margin:0;font-size:2.5rem;font-weight:700;color:white">What's your holiday kitchen vibe this year?</h3><p style="margin:0;font-size:1.5rem;font-weight:500;color:white;line-height:1.6;">Pick the option that best matches your kitchen vibe.</p><div style="display:flex;gap:2rem;margin-top:1.5rem;justify-content:center;"><button class="corner-banner-poll-button corner-banner-poll-button-left focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:3px solid rgb(20,184,166);color:white;padding:1.5rem 3.5rem;border-radius:12px;cursor:pointer;font-size:1.4rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;min-width:260px;">Press Left for Cozy cooking nights</button><button class="corner-banner-poll-button corner-banner-poll-button-right focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:3px solid rgb(20,184,166);color:white;padding:1.5rem 3.5rem;border-radius:12px;cursor:pointer;font-size:1.4rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;min-width:260px;">Press Right for Hosting &amp; showing off</button></div></div></div><div id="corner-banner-qr-state" class="corner-banner-qr-container" style="width:720px;max-width:95vw;display:none;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);"><div class="corner-banner-poll" style="background:rgba(0,0,0,0.6);border-radius:16px;padding:2.5rem 3rem;width:100%;max-width:850px;display:flex;flex-direction:column;gap:1.75rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><img src="https://raw.githubusercontent.com/akash768145s/img/main/hello.png" alt="Holiday kitchen hero" style="width:100%;height:auto;max-height:360px;object-fit:cover;border-radius:12px;margin-bottom:1.5rem;"><h3 style="margin:0;font-size:2.3rem;font-weight:700;color:white">Save up to 35% for the Holidays</h3><p style="margin:0;font-size:1.5rem;font-weight:500;color:white">Scan here</p><img src="https://raw.githubusercontent.com/akash768145s/img/main/o.png" id="qrAd1" alt="Holiday offer QR code" style="width:180px;height:180px;object-fit:contain;background:white;padding:0.75rem;border-radius:0.75rem;"><p style="margin:0;margin-top:1.25rem;font-size:1.6rem;font-weight:400;color:white">Brought to you by <span style="text-decoration:underline">fromourplace.com</span></p></div></div></div>`,
    `<div id="l-banner-host" class="lb-banner-host lb-visible" aria-live="polite" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;"><img src="https://raw.githubusercontent.com/akash768145s/img/main/s.png" class="corner-banner-santa-image" style="position:absolute;bottom:70px;left:20px;width:403px;height:auto;max-height:550px;object-fit:contain;z-index:10;pointer-events:none;display:block;"><div id="corner-banner-poll-state" class="corner-banner-poll-container" style="position:absolute;right:10px;bottom:70px;width:550px;height:400px;display:flex;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);transition:opacity 0.5s,transform 0.5s;"><div class="corner-banner-poll" style="background:rgba(0,0,0,0.6);border-radius:16px;padding:3rem 3.5rem;width:100%;max-width:850px;display:flex;flex-direction:column;gap:2rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><h3 style="margin:0;font-size:2.5rem;font-weight:700;color:white">Santa's checking his list</h3><p style="margin:0;font-size:2rem;font-weight:700;color:white;line-height:1.6;">Want to see if your child is on the nice list or Naughty list?</p><div style="display:flex;gap:2rem;margin-top:1.5rem;"><button class="corner-banner-poll-button corner-banner-poll-button-left focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:3px solid rgb(20,184,166);color:white;padding:1.5rem 3.5rem;border-radius:12px;cursor:pointer;font-size:1.75rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;">Press Left for Nice List</button><button class="corner-banner-poll-button corner-banner-poll-button-right focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:3px solid rgb(20,184,166);color:white;padding:1.5rem 3.5rem;border-radius:12px;cursor:pointer;font-size:1.75rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;">Press Right for Naughty List</button></div></div></div><div id="corner-banner-qr-state" class="corner-banner-qr-container" style="position:absolute;right:10px;bottom:70px;width:550px;height:400px;display:none;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);transition:opacity 0.5s,transform 0.5s;"><div class="corner-banner-qr" tabindex="-1" style="background:rgba(0,0,0,0.6);border-radius:16px;padding:3rem 3.5rem;width:100%;max-width:850px;display:flex;flex-direction:column;gap:1.75rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><p style="margin:0;font-size:2rem;font-weight:700;color:white;line-height:1.6;">Send your child a custom letter from Santa</p><p style="margin:0;font-size:1.75rem;font-weight:700;color:white">Scan Here</p><img src="https://raw.githubusercontent.com/akash768145s/img/main/q2.png" style="width:240px;height:240px;object-fit:contain;background:white;padding:1.25rem;border-radius:8px;"><p style="margin:1rem 0 0;font-size:1.6rem;font-weight:700;color:rgba(255,255,255,0.9);">Brought to you by PackageFromSanta.com</p></div></div></div>`,
    `<div id="l-banner-host" class="lb-banner-host lb-visible" aria-live="polite" style="position:fixed;right:24px;bottom:24px;width:auto;height:auto;pointer-events:none;z-index:9999;"><div id="corner-banner-poll-state" class="corner-banner-poll-container" style="width:460px;max-width:65vw;display:flex;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);transition:opacity 0.5s,transform 0.5s;"><div class="corner-banner-poll" style="background:rgba(0,0,0,0.3);border-radius:16px;padding:2.5rem 3.5rem;width:100%;max-width:700px;display:flex;flex-direction:column;gap:1.75rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><img src="https://raw.githubusercontent.com/akash768145s/img/main/c1.png" alt="Macy's deal hero" style="width:100%;height:auto;max-height:420px;object-fit:cover;border-radius:14px;margin-bottom:1.5rem;"><h3 style="margin:0;font-size:2rem;font-weight:700;color:white">If Macy's Dropped a secret Deal,which one are you grabbing?</h3><div style="display:flex;flex-direction:row;gap:1.25rem;margin-top:1.5rem;justify-content:center;width:100%;"><button class="corner-banner-poll-button corner-banner-poll-button-left focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:2px solid rgb(20,184,166);color:white;padding:1.25rem 2rem;border-radius:12px;cursor:pointer;font-size:1.45rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;min-width:180px;flex:1;">Press Left for 40% winter wear</button><button class="corner-banner-poll-button corner-banner-poll-button-right focusable adBtn" type="button" tabindex="0" data-webos-focusable="true" style="background:rgba(0,0,0,0.75);border:2px solid rgb(20,184,166);color:white;padding:1.25rem 2rem;border-radius:12px;cursor:pointer;font-size:1.35rem;font-weight:700;transition:0.2s;pointer-events:auto;position:relative;z-index:16;outline:none;min-width:180px;flex:1;">Press Right for Home Essentials Upgrade</button></div></div></div><div id="corner-banner-qr-state" class="corner-banner-qr-container" style="width:460px;max-width:65vw;display:none;align-items:center;justify-content:center;z-index:15;pointer-events:auto;opacity:1;transform:translateY(0);"><div class="corner-banner-poll" style="background:rgba(0,0,0,0.3);border-radius:16px;padding:2.5rem 3.5rem;width:100%;max-width:700px;display:flex;flex-direction:column;gap:1.75rem;align-items:center;text-align:center;color:white;pointer-events:auto;position:relative;z-index:15;"><img src="https://raw.githubusercontent.com/akash768145s/img/main/c1.png" alt="Macy's deal hero" style="width:100%;height:auto;max-height:420px;object-fit:cover;border-radius:14px;margin-bottom:1.5rem;"><h3 style="margin:0;font-size:1.9rem;font-weight:700;color:white">Seasonal Sales Collections</h3><p style="margin:0;font-size:1.3rem;font-weight:500;color:white">Scan Here</p><img src="https://raw.githubusercontent.com/akash768145s/img/main/m.png" alt="Macy's QR code" style="width:160px;height:160px;object-fit:contain;background:white;padding:1rem;border-radius:1rem;"><p style="margin:0;margin-top:1.5rem;font-size:1.6rem;font-weight:400;color:white">Brought to you by <span style="text-decoration:underline">macys.com</span></p></div></div></div>`,
  ];

  const impurls = [
    `https://canvas-siau-server-dev.vercel.app/api/track/impression/elem_corner_banner_1766044307401?elementType=corner-banner&tv=Vizio%20Action%20Plus`,
    `https://canvas-siau-server-dev.vercel.app/api/track/impression/elem_corner_banner_1764413032946?elementType=corner-banner&tv=Vizio%20Action%20Plus`,
    `https://canvas-siau-server-dev.vercel.app/api/track/impression/elem_corner_banner_1766072522478?elementType=corner-banner&tv=Vizio%20Action%20Plus`,
  ];

  const engurls = [
    `https://canvas-siau-server-dev.vercel.app/api/track/creativeClick/elem_corner_banner_1766044307401/segment1?elementType=l-banner&interactionType=l-squeeze&tv=Vizio%20Action%20Plus`,
    `https://canvas-siau-server-dev.vercel.app/api/track/creativeClick/elem_corner_banner_1764413032946/segment1?elementType=l-banner&interactionType=l-squeeze&tv=Vizio%20Action%20Plus`,
    `https://canvas-siau-server-dev.vercel.app/api/track/creativeClick/elem_corner_banner_1766072522478/segment1?elementType=l-banner&interactionType=l-squeeze&tv=Vizio%20Action%20Plus`,
  ];

  // Use triggered banner configuration
  const { adIndex, impIndex, engIndex, displayDuration } = triggeredBanner;
  childDiv.innerHTML = ads_list[adIndex];
  const imurl = impurls[impIndex];
  const enurl = engurls[engIndex];
  const bannerDisplayDuration = displayDuration || 5000; // Default 5 seconds

  fetch(imurl)
    .then(() => console.log('URL triggered'))
    .catch((err) => console.error(err));

  document.body.appendChild(childDiv);

  childDiv.setAttribute('data-webos-focusable', 'true');

  /* ---------- TIMER MANAGEMENT ---------- */
  let cleanupTimeout = null;

  /* ---------- CLEANUP ---------- */
  const cleanup = () => {
    overlayActive = false;

    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
      cleanupTimeout = null;
    }

    fetch(enurl).catch(() => { });

    // 1️⃣ REMOVE key interception FIRST (MOST IMPORTANT)
    document.removeEventListener('keydown', keyHandler, true);
    document.removeEventListener('keyup', keyUpHandler, true);

    // Remove banner DOM
    if (childDiv.parentNode) {
      childDiv.parentNode.removeChild(childDiv);
    }

    // Restore player UI state - return to normal behavior
    if (playerOverlay) {
      // If overlay was previously visible, restore it; otherwise let normal behavior handle it
      if (previousPlayerOverlayDisplay && previousPlayerOverlayDisplay !== 'none') {
        playerOverlay.style.display = previousPlayerOverlayDisplay;
      } else {
        // Reset to default state - normal player behavior will handle showing/hiding
        playerOverlay.style.display = 'none';
      }
    }
  };

  /* ---------- BUTTON CLICK ---------- */

  childDiv.querySelectorAll('.focusable').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pollState = document.getElementById('corner-banner-poll-state');
      const qrState = document.getElementById('corner-banner-qr-state');
      const bannerHost = document.getElementById('l-banner-host');

      if (pollState) pollState.style.display = 'none';
      if (qrState) {
        // Ensure parent container maintains positioning for indices 0 and 2
        if (bannerHost && (adIndex === 0 || adIndex === 2)) {
          bannerHost.style.position = 'fixed';
          bannerHost.style.right = '24px';
          bannerHost.style.bottom = '24px';
          bannerHost.style.top = 'auto';
          bannerHost.style.left = 'auto';
        }
        qrState.style.display = 'flex';
      }

      // Clear any existing timeout
      if (cleanupTimeout) clearTimeout(cleanupTimeout);

      // Set cleanup timer based on banner config
      cleanupTimeout = setTimeout(cleanup, bannerDisplayDuration);
    });
  });

  /* ---------- KEY HANDLERS (VIZIO REMOTE) ---------- */

  const adButtons = Array.from(childDiv.querySelectorAll('.adBtn'));
  let focusedIndex = 0;

  const focusButton = (index) => {
    if (!adButtons.length) return;
    const clamped = (index + adButtons.length) % adButtons.length;
    focusedIndex = clamped;
    const btn = adButtons[focusedIndex];
    // Ensure it's focusable on all platforms
    if (!btn.hasAttribute('tabindex')) {
      btn.setAttribute('tabindex', '0');
    }
    btn.focus();
  };

  // Try to set initial focus after the DOM has fully painted
  if (adButtons.length) {
    setTimeout(() => {
      focusButton(0);
    }, 0);
  } else {
    // Fallback: focus container
    setTimeout(() => {
      childDiv.focus();
    }, 0);
  }

  const keyHandler = (event) => {
    if (!overlayActive) return;

    const { keyCode } = event;

    // Navigation should always stay inside the banner while it's active
    const isInOverlay =
      document.activeElement === childDiv ||
      childDiv.contains(document.activeElement);

    if (!isInOverlay) {
      // If focus escaped, bring it back to the current button
      if (adButtons.length) {
        focusButton(focusedIndex);
      } else {
        childDiv.focus();
      }
    }

    // Left / Right
    if (keyCode === 37 || keyCode === 39) {
      if (adButtons.length) {
        focusButton(focusedIndex + (keyCode === 37 ? -1 : 1));
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    // Enter / OK
    if (keyCode === 13) {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.classList.contains('adBtn')) {
        activeEl.click();
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    // Back (support common TV keyCodes)
    if (keyCode === 8 || keyCode === 461 || keyCode === 27) {
      cleanup();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const keyUpHandler = (event) => {
    if (!overlayActive) return;
    const { keyCode } = event;
    if (
      keyCode === 37 ||
      keyCode === 39 ||
      keyCode === 13 ||
      keyCode === 8 ||
      keyCode === 27 ||
      keyCode === 461
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  document.addEventListener('keydown', keyHandler, true);
  document.addEventListener('keyup', keyUpHandler, true);

  return cleanup;
};

// Plugin-style wrapper so Player.jsx can keep using init/onTimeUpdate/etc.
const vizioCornerBannerPlugin = {
  init(playerInstance) {
    this.player = playerInstance;
    resetBannerState();
  },
  onPlay() { },
  onPause() { },
  onTimeUpdate(currentTimeSeconds) {
    if (!this.player) return;
    // Parent element isn't actually used (we always append to body),
    // but we keep the signature identical.
    createTrappedDiv(document.body, this.player, currentTimeSeconds);
  },
  destroy() {
    resetBannerState();
  },
};

export default vizioCornerBannerPlugin;

