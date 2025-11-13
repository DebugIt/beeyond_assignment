🛒 Real-Time Order & Delivery System

A full-stack real-time quick commerce application where customers can place orders, delivery partners update live statuses, and admins monitor all activity.
Built using Next.js, Node.js (Express), MongoDB, and Socket.io, fully Dockerized and self-hosted on AWS EC2 with Nginx reverse proxy.

🚀 Project Overview

The platform allows:

Customers to browse products, place orders, and track live delivery status.

Delivery Partners to accept and update order progress in real-time.

Admins to monitor system-wide activity, delivery partners, and live order statuses.

All services (frontend, backend, database) run in Docker containers orchestrated via docker-compose.
The app uses WebSockets (Socket.io) for real-time communication.

🧱 System Architecture Diagram
                    ┌────────────────────┐
                    │     Frontend       │
                    │  (Next.js + Nginx) │
                    └────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │     Backend API      │
                  │  (Express + Socket)  │
                  └────────┬─────────────┘
                           │
                           ▼
                  ┌──────────────────────┐
                  │      MongoDB DB      │
                  │ (Docker Container)   │
                  └──────────────────────┘

🧰 Tech Stack
Layer	Technology
Frontend	Next.js (React), TailwindCSS
Backend	Node.js + Express.js
Real-time	Socket.io
Database	MongoDB
Authentication	JWT (JSON Web Tokens)
Containerization	Docker, Docker Compose
Deployment	AWS EC2
Proxy	Nginx Reverse Proxy
📁 Folder Structure
root/
│
├── frontend/                 # Next.js frontend
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── backend/                  # Express + Socket.io backend
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
│
├── docker-compose.yml        # Orchestrates backend, frontend & Mongo
└── README.md

⚙️ Setup Instructions
🖥️ 1. SSH into Your Server
ssh -i your-key.pem ubuntu@your-ec2-public-ip

📦 2. Clone the Repository
git clone https://github.com/<your-username>/realtime-order-system.git
cd realtime-order-system

🧩 3. Environment Variables

Create .env files in backend/ and frontend/.

backend/.env
PORT=5555
MONGO_URI=mongodb://mongo:27017/realtimeorders
JWT_SECRET=supersecretkey
NODE_ENV=production

frontend/.env.local
NEXT_PUBLIC_BASE_URL=http://localhost:5555
NEXT_PUBLIC_SOCKET_URL=ws://localhost:5555

🐳 Docker Setup
Build and Run Containers
docker-compose up --build

Access
Service	URL
Frontend	http://localhost:3000

Backend API	http://localhost:5555

WebSocket	ws://localhost:5555
MongoDB	localhost:27017
💚 Health Check Endpoint

Your backend includes a simple monitoring endpoint:

GET /health
→ { "status": "ok", "uptime": 1023 }

🌐 Hosting & Deployment Steps

Launch an AWS EC2 instance

OS: Ubuntu 22.04

Open ports: 22 (SSH), 80 (HTTP), 3000 (frontend), 5555 (backend)

Install Docker & Docker Compose

sudo apt update
sudo apt install docker.io docker-compose -y


Clone your repo

git clone <repo-url>
cd realtime-order-system


Start all services

docker-compose up -d


Set up Nginx reverse proxy

Serve frontend at /

Proxy API requests /api → backend:5555

Proxy WebSockets /socket.io → backend:5555

🔄 Example Nginx Config
server {
    listen 80;

    server_name yourdomain.com;

    location / {
        proxy_pass http://frontend:3000;
    }

    location /api/ {
        proxy_pass http://backend:5555/;
    }

    location /socket.io/ {
        proxy_pass http://backend:5555/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

🔌 WebSocket Flow Explanation

Customer places order → backend emits order_created

Delivery partner accepts → backend locks order & emits order_accepted

Partner updates progress → backend emits order_status_update

Customer receives real-time updates → Socket.io client listens and updates UI live

Admin dashboard subscribes to all orders for monitoring

⚖️ Scaling Plan
1. Add Redis for Socket Scaling

Use Socket.io Redis Adapter

Synchronizes events across multiple backend instances

Enables horizontal scaling of real-time traffic

npm install @socket.io/redis-adapter redis

2. Horizontal Scaling

Use AWS Load Balancer (ALB/NLB) to distribute traffic

Deploy multiple backend containers behind load balancer

Store sessions and sockets in Redis for persistence

💡 Future Improvements

Implement delivery location tracking with Google Maps API

Add order notifications via email/SMS

Role-based admin dashboard analytics

Use CI/CD pipeline with GitHub Actions

SSL with Certbot on Nginx

📸 Demo Video

🎥 (Attach your Loom or Google Drive demo video link here)
Example: Watch Demo

🔗 Live URLs
Type	URL
Frontend	http://yourdomain.com

Backend API	http://api.yourdomain.com

WebSocket	ws://api.yourdomain.com
🧑‍💻 Author

Ronak A. Bhanushali
Full Stack Developer | MERN | DevOps | Cybersecurity Enthusiast
GitHub: @DebugIt