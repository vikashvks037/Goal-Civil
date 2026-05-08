'use client';
import { ENDPOINTS } from '@/constants';
import { useApi } from '@/shared/hooks/useApi';
import { useEffect } from 'react';

export function useEnrollments() {
  const { data, loading, error, call } = useApi();
  useEffect(() => { call(ENDPOINTS.STUDENT.ENROLLMENTS); }, [call]);
  return { enrollments: data?.enrollments ?? [], loading, error };
}
