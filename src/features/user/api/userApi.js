import { ENDPOINTS } from '@/constants';

export const userApi = {
  getProfile:    () =>
    fetch(ENDPOINTS.PROFILE).then(r => r.json()),
  updateProfile: (p) =>
    fetch(ENDPOINTS.PROFILE, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).then(r => r.json()),
};
