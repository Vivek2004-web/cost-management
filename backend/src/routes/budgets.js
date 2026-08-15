const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/budgets - Get user's cloud budgets with current spending status
router.get('/', authenticateToken, (req, res) => {
  try {
    const userBudgets = db.prepare('SELECT * FROM budgets WHERE user_id = ?').all(req.user.id);

    // Calculate current month spending dynamically based on current date
    const now = new Date();
    const currentDayOfMonth = now.getDate();
    const currentMonthCost = parseFloat((currentDayOfMonth * 104.00 * 1.05).toFixed(2)); // Current Month Spending (MTD)

    const enrichedBudgets = userBudgets.map(b => {
      const currentSpending = currentMonthCost;
      const usagePercentage = parseFloat(((currentSpending / b.monthly_limit) * 100).toFixed(1));
      let status = 'NORMAL';
      if (usagePercentage >= 100) {
        status = 'EXCEEDED';
      } else if (usagePercentage >= b.alert_threshold) {
        status = 'WARNING';
      }

      return {
        id: b.id,
        category: b.category,
        monthlyLimit: b.monthly_limit,
        alertThreshold: b.alert_threshold,
        currentSpending,
        usagePercentage,
        status,
        remainingBudget: parseFloat(Math.max(0, b.monthly_limit - currentSpending).toFixed(2))
      };
    });

    res.json({
      success: true,
      budgets: enrichedBudgets
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget tracking settings.' });
  }
});

// POST /api/budgets - Create new budget target
router.post('/', authenticateToken, (req, res) => {
  try {
    const { category, monthlyLimit, alertThreshold } = req.body;

    if (!monthlyLimit || isNaN(monthlyLimit) || monthlyLimit <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid monthly budget limit.' });
    }

    const stmt = db.prepare(`
      INSERT INTO budgets (user_id, category, monthly_limit, alert_threshold)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      req.user.id,
      category || 'Overall Cloud Spending',
      parseFloat(monthlyLimit),
      alertThreshold ? parseInt(alertThreshold, 10) : 80
    );

    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      req.user.id,
      'CREATE_BUDGET',
      `Set budget $${monthlyLimit} for ${category || 'Overall Cloud'}`
    );

    res.status(201).json({
      success: true,
      message: 'Budget set successfully!',
      budgetId: info.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create budget limit.' });
  }
});

// PUT /api/budgets/:id - Update budget limit
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { category, monthlyLimit, alertThreshold } = req.body;

    const existing = db.prepare('SELECT * FROM budgets WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Budget record not found.' });
    }

    db.prepare(`
      UPDATE budgets
      SET category = ?, monthly_limit = ?, alert_threshold = ?
      WHERE id = ? AND user_id = ?
    `).run(
      category || existing.category,
      monthlyLimit ? parseFloat(monthlyLimit) : existing.monthly_limit,
      alertThreshold ? parseInt(alertThreshold, 10) : existing.alert_threshold,
      id,
      req.user.id
    );

    res.json({ success: true, message: 'Budget updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update budget.' });
  }
});

// DELETE /api/budgets/:id - Delete budget limit
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM budgets WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true, message: 'Budget removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete budget.' });
  }
});

module.exports = router;
