import { ENDPOINTS } from '@/constants';

export const courseApi = {
  list: (p) => {
    const q = p ? '?' + new URLSearchParams(p).toString() : '';
    return fetch(`${ENDPOINTS.COURSES.LIST}${q}`).then(r => r.json());
  },
  bySlug:          (slug)     => fetch(ENDPOINTS.COURSES.BY_SLUG(slug)).then(r => r.json()),
  checkEnrollment: (courseId) => fetch(ENDPOINTS.ENROLLMENTS.CHECK(courseId)).then(r => r.json()),
};
