<div align="center">

# ☁️ Cloud Cost Monitor & FinOps Optimizer

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=githubactions)](https://github.com/Vivek2004-web/cost-management)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**An Enterprise-Grade, Full-Stack Cloud Financial Management & FinOps Platform**

*Monitor, analyze, forecast, and optimize multi-cloud infrastructure spending across AWS, Azure, and GCP in real time.*

</div>

---

## 🌟 Overview

**Cloud Cost Monitor** provides cloud infrastructure engineers and financial leaders with real-time cost visibility, intelligent budget tracking, automated cost-saving recommendations, and multi-cloud breakdown analytics. 

Whether running live with official AWS SDK credentials or using built-in interactive Demo Mode, the platform delivers predictive analytics, anomaly alerts, invoice generation, and AI-driven optimization advice.

---

## 🏗️ Architecture Blueprint

```mermaid
graph TD
    subgraph Client ["Client Layer (Frontend)"]
        UI["React 18 + Vite Web App"]
        Glass["Glassmorphism UI / Lucide Icons"]
        Charts["Recharts Visualizations"]
        UI --> Glass
        UI --> Charts
    end

    subgraph API ["Application Layer (Backend API)"]
        Server["Express.js Server (Port 5001)"]
        Auth["JWT & bcrypt Authentication"]
        ErrorMiddleware["Standardized Error Middleware"]
        Server --> Auth
        Server --> ErrorMiddleware
    end

    subgraph Data ["Data & Services Layer"]
        DB[("SQLite Database<br/>(better-sqlite3)")]
        SDK["AWS SDK Cost Explorer"]
        Demo["Demo Simulation Engine"]
    end

    UI -->|REST API + JWT Bearer Token| Server
    Server -->|User & Settings Records| DB
    Server -->|Live Queries (with AWS Creds)| SDK
    Server -->|Fallback Analytics| Demo
```

---

## ⚡ Key Features

- 📊 **Real-time Spending Dashboard**: Monthly total cost overview, daily run rate, month-over-month trend percentages, and end-of-month financial forecasting.
- 🎯 **Budget Tracking & Anomaly Alerts**: Custom target budgets per category with progressive visual warnings at 80% and 100% thresholds.
- 💡 **AI Optimization Assistant**: Automated recommendations for idle EC2 instances, unattached EBS storage volumes, S3 lifecycle policies, and Savings Plans.
- 🔍 **Interactive Command Palette**: Quick access keyboard navigation (`Cmd/Ctrl + K`) across resources, reports, and settings.
- 📑 **Invoice & Report Generator**: Generate exportable PDF invoices and expense summaries powered by `jspdf`.
- 🔐 **Secure JWT Authentication**: Account registration and login powered by bcrypt password hashing and persistent SQLite storage.
- 🐳 **Production Docker Containerization**: Multi-container orchestra using Nginx reverse proxy, Vite frontend build, and Express backend API.
- 🔄 **Automated CI/CD**: GitHub Actions workflow for continuous testing, Docker build verification, and deployment.

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Single-page application client framework |
| **Styling** | Custom Glassmorphism CSS | Responsive, dark-mode design system |
| **Charts** | Recharts | Interactive daily expense area & pie charts |
| **Icons** | Lucide React | Modern vector icon system |
| **Backend API** | Node.js, Express.js | REST API server framework |
| **Database** | SQLite (`better-sqlite3`) | Persistent storage for users, settings & budgets |
| **Security** | JWT, `bcryptjs` | Authentication & token verification |
| **SDK** | `@aws-sdk/client-cost-explorer` | Official AWS Cost Explorer integration |
| **DevOps** | Docker, Docker Compose, Nginx | Containerization & reverse proxy |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Backend API Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
*Backend server will listen at `http://localhost:5001`.*

### 2. Frontend Web App Setup
Open a second terminal window:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
*Frontend client will run at `http://localhost:3000`.*

---

## 🐳 Docker Deployment

To spin up the entire application stack in containerized production mode:

```bash
docker compose up --build -d
```

- **Frontend App**: `http://localhost:80`
- **Backend Health Check**: `http://localhost:5001/api/health`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | 🔓 |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | 🔓 |
| `GET` | `/api/auth/me` | Retrieve active user profile | 🔒 |
| `PUT` | `/api/auth/settings` | Update AWS credentials & Demo Mode | 🔒 |
| `GET` | `/api/costs/overview` | Fetch financial overview & chart data | 🔒 |
| `GET` | `/api/costs/recommendations` | Get AI cost optimization suggestions | 🔒 |
| `GET` | `/api/budgets` | Fetch active user budget targets | 🔒 |
| `POST` | `/api/budgets` | Create new category budget target | 🔒 |
| `DELETE` | `/api/budgets/:id` | Remove budget target | 🔒 |
| `GET` | `/api/health` | System health check & DB status | 🔓 |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and submission process.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
