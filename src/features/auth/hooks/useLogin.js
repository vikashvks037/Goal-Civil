'use client';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/authApi';

export function useLogin(){
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const login=async(p)=>{
    setLoading(true);setError('');
    try{ const d=await authApi.login(p); if(d.error){setError(d.error);return null;} router.push(d.redirectTo||ROUTES.STUDENT.DASHBOARD);router.refresh();return d; }
    catch{setError('Network error.');return null;}
    finally{setLoading(false);}
  };
  return {login,loading,error};
}
