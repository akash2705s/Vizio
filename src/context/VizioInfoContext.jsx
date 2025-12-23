import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const VizioInfoContext = createContext({
  deviceId: '',
  ifa: '',
  ifaType: '',
  lmt: '',
  isCCEnabled: false,
  isTTSEnabled: false,
  firmwareVersion: '',
  getUserAgent: () => {},
  getDeviceModel: () => {},
  getUUID: () => {},
  getDeviceHeight: () => {},
  getDeviceWidth: () => {},
});

const VizioInfoProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState('');
  const [ifa, setIFA] = useState('');
  const [ifaType, setIFAType] = useState('');
  const [lmt, setLMT] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isCCEnabled, setIsCCEnabled] = useState(false);
  const [firmwareVersion, setFirmwareVersion] = useState('');

  const addCallback = useCallback(() => {
    // all secondary handlers inside the primary
    // Device ID
    window.VIZIO.getDeviceId((id) => {
      console.log(`Unique Device Id: ${id}`);
      setDeviceId(id);
    });
    // IFA - ID for Advertisement
    window.VIZIO.setAdvertiserIDListener((AdvertiserID) => {
      console.log(`Advertiser ID: ${AdvertiserID.IFA}`);
      console.log(`Advertiser ID Type: ${AdvertiserID.IFA_TYPE}`);
      console.log(`Limit Ad Tracking: ${AdvertiserID.LMT}`);
      setIFA(AdvertiserID.IFA);
      setIFAType(AdvertiserID.IFA_TYPE);
      setLMT(AdvertiserID.LMT);
    });
    // TTS
    document.addEventListener(
      'VIZIO_TTS_ENABLED',
      (e) => {
        setIsTTSEnabled(true);
        console.log(e, 'TTS ENABLED');
      },
      false
    );
    document.addEventListener(
      'VIZIO_TTS_DISABLED',
      (e) => {
        setIsTTSEnabled(false);
        console.log(e, 'TTS DISABLED');
      },
      false
    );
    // Closed Captions
    window.VIZIO.setClosedCaptionHandler((ccEnabled) => {
      setIsCCEnabled(ccEnabled);
    });
    window.VIZIO.getFirmwareVersion((version) => {
      setFirmwareVersion(version);
    });
  }, []);

  const registerCallback = useCallback(() => {
    if (window.VIZIO) {
      addCallback();
    } else {
      document.addEventListener('VIZIO_LIBRARY_DID_LOAD', addCallback, false);
    }
  }, [addCallback]);

  const getUserAgent = useCallback(() => window.navigator.userAgent, []);

  const getDeviceModel = useCallback(() => window.VIZIO?.deviceModel, []);
  const getUUID = useCallback(() => uuidv4(), []);
  const getDeviceWidth = useCallback(() => window.innerWidth, []);
  const getDeviceHeight = useCallback(() => window.innerHeight, []);

  useEffect(() => {
    registerCallback();
  }, [registerCallback]);

  const contextValue = useMemo(
    () => ({
      deviceId,
      ifa,
      ifaType,
      lmt,
      isCCEnabled,
      isTTSEnabled,
      firmwareVersion,
      getUserAgent,
      getDeviceModel,
      getUUID,
      getDeviceHeight,
      getDeviceWidth,
    }),
    [
      deviceId,
      ifa,
      ifaType,
      lmt,
      isCCEnabled,
      isTTSEnabled,
      firmwareVersion,
      getDeviceHeight,
      getDeviceModel,
      getDeviceWidth,
      getUUID,
      getUserAgent,
    ]
  );

  return (
    <VizioInfoContext.Provider value={contextValue}>
      {children}
    </VizioInfoContext.Provider>
  );
};

VizioInfoProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export { VizioInfoProvider, VizioInfoContext };
