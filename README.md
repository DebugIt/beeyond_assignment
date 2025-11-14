# Swigato

## Project Overview
Beeyond Assignment (Swigato) is a real-time web application demonstrating user authentication, live socket updates, and full-stack deployment using AWS EC2, Docker & Nginx. User can register (as Customer or Delivery Partner), login , and receive live updates.
Admin/backend interactions are handled through REST APIs.
Real-time events (like order updates) are powered via WebSockets.

## System Architechture Diagram
-----------------------------------------------------------------------------
|                                                                           |
|   +----------------+         +----------------+         +-------------+   |
|   |   Frontend     | <-----> |    Backend     | <-----> |    MongoDB  |   |
|   | (React/Next.js)|         |  (Node/Express)|         |             |   |
|   +----------------+         +----------------+         +-------------+   |
|            ^                                                              |
|            |                                                              |
|            v                                                              |
|        WebSocket                                                          |
|                           AWS EC2                                         |
-----------------------------------------------------------------------------
Frontend communicated with Backend via RESTAPi's and Websockets
Backend here handles the communication with DB, requests, sockets and queries

## Tech Stack used:
- Frontend: NextJS
- Backend: NodeJs, ExpressJs
- Database: MongoDB (setup on local inside Docker)
- Websockets: Socket.IO
- Containarization: Docker & Docker Compose
- Deployment: AWS EC2 / Linux Ubuntu Server
- Other: .env for Environment variables, Cookie based authentication with JWT (JsonWebToken)

## Folder Structure
beeyond_assignment/
├── backend/
│   ├── connections/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
|   ├── .env
|   ├── server.js
|   └── socket.js
├── frontend/
│   ├── pages/
|   ├── context/
|   ├── assets
|   ├── fetch/index.js (interceptor)
│   ├── components/
|   ├── socket.js
│   └── .env
├── docker-compose.yml
└── README.md


## Setup Instructions
SSH into server:
- ssh ubuntu@<public_ip_sent_over_email>

Clone this repository:
- git clone Github Repository: https://github.com/DebugIt/beeyond_assignment
- cd beeyond_assignment

## Setup Environment Variables
Frontend (.env)
- NEXT_PUBLIC_BASE_URL=<url_attached_in_emai>
- NEXT_PUBLIC_SOCKET_URL=<url_attached_in_email>

Backend (.env)
- PORT=5555
- MONGO_URI=mongodb://mongo:27017/beeyond
- JWT_SECRET=supersecretkey
- NODE_ENV=production

## Start Docker Container
- sudo docker-compose up --build -d
- sudo docker ps -a

## Hosting & Deployment Steps
- Configure server security and open the necessary ports : 3000, 27017, 80 etc.
- Ensure Docker & Docker-Compose, nginx are installed and configured to link to a domain
- Clone repo. and set the .env variables
- Use command $ sudo docker-compose up --build -d
- Verify backend status with $ curl <backend_url>/health
- Access the frontend with $<frontend_url_here>

## WebSocket Flow Explanation
Frontend connects to backend using Socket.IO with withCredentials: true.
Backend Socket.IO server listens for connections.
Backend emits events (e.g., order updates) to connected clients.
Frontend receives events and updates the UI in real-time.

Flow Example:
Frontend -> connect -> Backend Socket.IO
Backend -> emit("orderUpdate") -> Frontend receives update

## Scaling Plan
Redis for Socket Scaling
Use Redis Pub/Sub with Socket.IO Adapter for multiple backend instances.
Ensures events propagate across all server instances
Horizontal Scaling with Load Balancer
Deploy multiple backend instances behind Nginx/HAProxy.
Load balancer distributes incoming HTTP/WebSocket traffic.
Combined with Redis, ensures all sockets stay in sync across instances.

## Future Improvements (Optional)
Enable SSL/TLS for secure cookies and WebSocket connections.
Add role-based authorization for admin routes.
Implement logging and monitoring using Prometheus/Grafana.
Add rate-limiting and security headers for production readiness.
Integrate CI/CD pipeline for automated deployment.
