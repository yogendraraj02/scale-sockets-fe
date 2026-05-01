import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const stopServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/stop`);
export const startServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/start`);

