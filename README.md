# ☁️ AWS Cloud Cost Monitor & Optimizer

A full-stack, dynamic cloud financial management web application built to monitor, analyze, and optimize AWS spending in real-time. Features interactive cost analytics, budget alerts, AI optimization recommendations, SQLite user database record-keeping, Docker containerization, EC2 deployment automation, and CI/CD via GitHub Actions.

---

## 🌟 Key Features

- 📊 **Dashboard with Total Monthly Cost**: Real-time spending overview with month-over-month trend percentages and monthly run-rate forecast.
- 💰 **Today's Cloud Cost**: Current day spending metrics & daily expense run rate.
- ☁️ **Highest-Cost AWS Service**: Instant tracking of top cost driver (EC2, RDS, S3, Lambda, EKS, etc.).
- 📈 **Daily Spending Charts**: Interactive historical area charts & service allocation pie charts powered by Recharts.
- 🎯 **Budget Tracking & Alerting**: Configurable budget targets per category with visual progress bars and warning thresholds (e.g. 80%, 100%).
- 💡 **Cost Optimization Recommendations**: Automated recommendations for idle EC2 instances, unattached EBS volumes, S3 lifecycle transitions, and Savings Plans with estimated monthly savings.
- 🔐 **User Authentication & Persistent Record Keeping**: Full JWT-based auth (Register/Login) powered by Express and SQLite (`cloud_monitor.db`).
- 🔗 **AWS Cost Explorer API Integration**: Support for live AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`) plus seamless Demo Mode toggle with realistic data simulation.
- 🐳 **Docker Containerization**: Production-ready multi-container setup (`docker-compose.yml`, `Dockerfile.backend`, `Dockerfile.frontend`).
- ☁️ **EC2 Deployment Script**: 1-command deployment script (`deploy-ec2.sh`) for AWS EC2 Ubuntu instances.
- 🔄 **CI/CD with GitHub Actions**: Automated test, build, and SSH deployment pipeline (`.github/workflows/deploy.yml`).

---

## 🏗️ Architecture Stack

- **Frontend**: React 18, Vite, Recharts, Lucide React Icons, Custom Glassmorphism CSS design system.
- **Backend**: Node.js, Express.js, SQLite (`better-sqlite3`), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, AWS SDK (`@aws-sdk/client-cost-explorer`).
- **DevOps**: Docker, Docker Compose, Nginx, Shell scripts, GitHub Actions.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js 18 or 20+ installed
- npm 9+

### 1. Start the Backend API Server
```bash
cd server
npm install
npm run dev
```
*The Express backend server will start on `http://localhost:5001`.*

### 2. Start the Frontend Development Client
Open a new terminal tab:
```bash
cd client
npm install
npm run dev
```
*The React Vite app will run on `http://localhost:3000`.*

---

## 🐳 Running with Docker & Docker Compose

Launch the entire full-stack application (Nginx + Frontend + Express + SQLite DB) with a single command:

```bash
docker compose up --build -d
```

- **Frontend Web UI**: `http://localhost:80`
- **Backend Health Check**: `http://localhost:5001/api/health`

---

## ☁️ Deploying to AWS EC2

1. Launch an Ubuntu EC2 instance on AWS (e.g. `t3.micro` or `t3.small`).
2. Open ports `80` (HTTP) and `5001` in your EC2 Security Group inbound rules.
3. SSH into your instance and run:
```bash
git clone <your-repository-url>
cd <repository-folder>
chmod +x scripts/deploy-ec2.sh
./scripts/deploy-ec2.sh
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/settings` | Update AWS credentials & Demo Mode | Yes |
| `GET` | `/api/costs/overview` | Fetch total cost, today's cost & daily charts | Yes |
| `GET` | `/api/costs/recommendations` | Get AI cost-saving recommendations | Yes |
| `GET` | `/api/budgets` | Get active user budgets | Yes |
| `POST` | `/api/budgets` | Set new budget target | Yes |
| `DELETE` | `/api/budgets/:id` | Remove budget target | Yes |
