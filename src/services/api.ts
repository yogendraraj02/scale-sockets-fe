import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAuthToken = async (userId: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Auth failed');
  const { token } = await res.json();
  return token;
};

export const stopServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/stop`);
export const startServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/start`);
export const analyzeLogs = () => axios.post(`${BASE_URL}/analyze-logs`, { timeRange: '1h', analysisType: 'summary' });

