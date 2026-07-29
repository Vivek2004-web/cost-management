require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');
const costRoutes = require('./routes/costs');
const budgetRoutes = require('./routes/budgets');
const alertRoutes = require('./routes/alerts');
const checklistRoutes = require('./routes/checklist');
const creditRoutes = require('./routes/credits');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/credits', creditRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'Multi-Cloud FinOps Assistant API',
    timestamp: new Date().toISOString(),
    database: 'SQLite Connected',
    providers: ['AWS', 'Azure', 'GCP']
  });
});

// Serve frontend static build
const clientBuildPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const errorHandler = require('./middleware/errorHandler');

// Error handling middleware
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Multi-Cloud FinOps Assistant Application running on http://localhost:${PORT}`);
});
