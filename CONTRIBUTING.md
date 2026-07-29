# Contributing to Cloud Cost Management Platform

Thank you for considering contributing to the **Cloud Cost Monitor & FinOps Assistant**! We welcome bug reports, feature suggestions, documentation enhancements, and pull requests.

---

## 🛠️ Development Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/Vivek2004-web/cost-management.git
   cd cost-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

---

## 📋 Guidelines

- **Code Style**: Ensure clean, readable Javascript (ES6+) and React code. Follow existing modular component patterns.
- **Git Commit Messages**: Use standard conventional commit formats:
  - `feat: add anomaly radar breakdown component`
  - `fix: correct percentage run-rate calculation`
  - `docs: update deployment guidelines`
- **Testing**: Run local build checks before opening pull requests (`npm run build` in `frontend`).

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
