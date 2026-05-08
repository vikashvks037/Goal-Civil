'use client';
import { useState, useCallback } from 'react';
export function useToggle(init=false){
  const [v,setV]=useState(init);
  return [v,useCallback(()=>setV(x=>!x),[]),setV];
}
