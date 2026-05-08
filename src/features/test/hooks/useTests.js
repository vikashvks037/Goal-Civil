'use client';
import { ENDPOINTS } from '@/constants';
import { useApi } from '@/shared/hooks/useApi';
import { useEffect } from 'react';

export function useTests() {
  const { data, loading, error, call } = useApi();
  useEffect(() => { call(ENDPOINTS.STUDENT.TESTS); }, [call]);
  return { tests: data?.tests ?? [], loading, error };
}
