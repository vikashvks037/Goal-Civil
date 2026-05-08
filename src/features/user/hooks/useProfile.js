'use client';
import { ENDPOINTS } from '@/constants';
import { useApi } from '@/shared/hooks/useApi';
import { useEffect } from 'react';

export function useProfile() {
  const { data, loading, error, call } = useApi();
  useEffect(() => { call(ENDPOINTS.PROFILE); }, [call]);
  return { profile: data?.user ?? null, loading, error, refetch: () => call(ENDPOINTS.PROFILE) };
}
