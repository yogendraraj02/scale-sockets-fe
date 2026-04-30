# WebSocket Scaling Simulator

A production-inspired demonstration of how real-time WebSocket applications scale horizontally across multiple server instances — with live failure simulation and cross-server messaging via Redis Pub/Sub.

---

## The Problem

In a single-server setup, real-time messaging is straightforward — every connected client is reachable directly. However, once the application is deployed across multiple instances (for scalability or reliability), users connected to **different servers cannot communicate directly**.

This project solves that problem using **Redis Pub/Sub as a message broker** between servers, ensuring any client can message any other client regardless of which server they're connected to. It also demonstrates **server failure scenarios** — stopping a server instance mid-session and watching traffic automatically reroute.

---

## Frontend Dashboard

A lightweight dashboard is included to observe the system in real time.

It provides:

- **Servers View**  
  Displays all server instances with their status (up/down) and allows starting or stopping them.

- **Connected Clients**  
  Shows active clients and the server handling each connection.

- **Activity Log**  
  Real-time stream of events such as connections, disconnections, server lifecycle, and message routing.

- **Messaging Interface**  
  Send messages between clients and observe delivery across different server instances.

The dashboard acts as a visual layer to understand how load balancing and Redis-based message propagation behave under different conditions.


---

## Screenshot

<!-- ![Dashboard](./assets/client.png) -->
<p align="center">
  <img src="./assets/client.png" width="48%" />
  <img src="./assets/failure.png" width="48%" />
</p>


---

## Architecture

```
                        Client (Browser / Postman)
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     NGINX (Port 8080)    │
                    │   Load Balancer          │
                    │   Strategy: least_conn   │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
       ┌────────────┐    ┌────────────┐    ┌────────────┐
       │  Server S1  │    │  Server S2  │    │  Server S3  │
       │  :3001      │    │  :3002      │    │  :3003      │
       │             │    │             │    │             │
       │ C1, C4      │    │ C2, C5      │    │ C3          │
       └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │     Redis Pub/Sub        │
                    │   Channel: user_messages │
                    │   Registry: clients hash │
                    │   Registry: servers hash │
                    │   Log: activity_log list │
                    └─────────────────────────┘
```

**Cross-server message flow:**
```
C1 (on S1) sends message → to C3 (on S3)
  S1 publishes to Redis channel "user_messages"
  S2, S3 both receive the message
  S3 finds C3 in local connections → delivers ✅
  S2 ignores (C3 not connected here)
```

---


## Key Concepts Demonstrated

- **Horizontal scaling** of stateful WebSocket servers
- **Redis Pub/Sub** for cross-process event propagation
- **Load balancing** with NGINX using `least_conn` strategy
- **Service registry** pattern — servers self-register on startup
- **Failure recovery** — traffic reroutes automatically when a node goes down