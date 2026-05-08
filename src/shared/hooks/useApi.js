'use client';
import { useState, useCallback } from 'react';

export function useApi() {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const call = useCallback(async (url, options) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setState(s => ({ ...s, loading: false, error: msg }));
      return null;
    }
  }, []);
  return { ...state, call };
}
