import { useRef, useCallback } from 'react';

const useAbortController = () => {
  const abortControllerRef = useRef(null);

  const createAbortController = useCallback(() => {
    // Abort any existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const abortCurrentRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const getSignal = useCallback(() => abortControllerRef.current?.signal, []);

  return {
    createAbortController,
    abortCurrentRequests,
    getSignal,
    abortController: abortControllerRef.current,
  };
};

export default useAbortController;
