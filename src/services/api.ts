import axios from 'axios';
import type { GetClientResponse, GetLogsResponse, GetServerResponse } from '../types';

const BASE_URL = 'http://localhost:8080/api';

export const getClients = () => axios.get<GetClientResponse>(`${BASE_URL}/clients`);
export const getServers = () => axios.get<GetServerResponse>(`${BASE_URL}/servers`);
export const getLogs = () => axios.get<GetLogsResponse>(`${BASE_URL}/logs`);
export const stopServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/stop`);
export const startServer = (serverId: string) => axios.post(`${BASE_URL}/servers/${serverId}/start`);

