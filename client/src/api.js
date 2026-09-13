import { useEffect, useState } from 'react';
export function useResource(url) {
  const [state, setState] = useState({
    data: null,
    loading: !!url,
    error: ''
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!url) {
      setState({
        data: null,
        loading: false,
        error: ''
      });
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), 15000);
    setState({
      data: null,
      loading: true,
      error: ''
    });
    fetch(url, {
      signal: controller.signal
    }).then(async response => {
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('The service is unavailable. Make sure the API is running.');
      }
      if (!response.ok) throw new Error(data.error || 'Unable to load this information.');
      if (!controller.signal.aborted) setState({
        data,
        loading: false,
        error: ''
      });
    }).catch(error => {
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setState({
        data: null,
        loading: false,
        error: controller.signal.reason === 'timeout' ? 'The request timed out. Please try again.' : error.message
      });
    }).finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, attempt]);
  return {
    ...state,
    retry: () => setAttempt(v => v + 1)
  };
}
