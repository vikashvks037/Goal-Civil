import { ENDPOINTS } from '@/constants';

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(r => r.json());

export const testApi = {
  list:        ()           => fetch(ENDPOINTS.STUDENT.TESTS).then(r => r.json()),
  start:       (id)         => post(ENDPOINTS.STUDENT.TEST_START(id)),
  submit:      (id, answers) => post(ENDPOINTS.STUDENT.TEST_SUBMIT(id), { answers }),
  results:     ()           => fetch(ENDPOINTS.STUDENT.RESULTS).then(r => r.json()),
  resultById:  (id)         => fetch(ENDPOINTS.STUDENT.RESULT_BY_ID(id)).then(r => r.json()),
  leaderboard: (testId)     => fetch(ENDPOINTS.STUDENT.LEADERBOARD(testId)).then(r => r.json()),
};
