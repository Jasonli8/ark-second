import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      const options = {
        method,
        headers,
        body,
        signal: httpAbortCtrl.signal,
      }
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        if (err.message === 'Failed to fetch') {
          setError('Couldn\'t retrieve data. Please try again later. (Error code: 503)')
        } else {
          setError(err.message);
        }
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};