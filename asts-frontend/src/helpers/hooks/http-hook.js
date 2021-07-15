import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [errorDetails, setErrorDetails] = useState();

  const activeHttpRequests = useRef([]);

  let activeError = false;

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
      };
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          setError(`Couldn\'t retrieve data. Please try again later.`);
          setErrorDetails(`${response.status} Error: ${responseData.message}`);
          activeError = true;
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        if (!activeError) {
          setError(
            `Couldn\'t connect. Please check your connection and try again.`
          );
          setErrorDetails(`${503} Error: Fetch called upon an unavailable service.`);
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
    setErrorDetails(null);
    activeError=false;
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading, error, errorDetails, sendRequest, clearError };
};
