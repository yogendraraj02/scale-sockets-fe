export interface Server {
  serverId: string
  port: string
  status: 'up' | 'down'
  startedAt: string
}

export interface Client {
  userId: string
  connectedServer: string
  socketId: string
  status: 'online' | 'offline'
}


export interface Log {
  event: string,
  time: string
}
export interface Message {
  from: string
  text: string
}

export interface DashboardData {
  servers: Server[]
  clients: Client[]
  logs: Log[]
}

