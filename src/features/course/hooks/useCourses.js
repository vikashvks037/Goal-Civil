'use client';
import { ENDPOINTS } from '@/constants';
import { useApi } from '@/shared/hooks/useApi';
import { useEffect } from 'react';

export function useCourses() {
  const { data, loading, error, call } = useApi();
  useEffect(() => { call(ENDPOINTS.COURSES.LIST); }, [call]);
  return { courses: data?.courses ?? [], loading, error };
}
