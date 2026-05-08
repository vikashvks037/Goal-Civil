'use client';
import { useState } from 'react';
import { paymentApi } from '../api/paymentApi';
export function usePayment(){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const initiatePayment=async(courseId,couponCode)=>{
    setLoading(true);setError('');
    try{ const o=await paymentApi.createOrder(courseId,couponCode); if(!o.orderId)throw new Error('Failed to create order'); return o; }
    catch(e){ setError(e instanceof Error?e.message:'Payment failed'); return null; }
    finally{setLoading(false);}
  };
  return {initiatePayment,loading,error};
}
