import { callApi } from '@utils/api/call-api';
import { JokesApiResponse } from '.';

export async function callJokesApi(): Promise<string> {
  const res = await callApi<JokesApiResponse>('jokes', 'GET');
  return res.data;
}
