const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Seed initial cloud credits for user if empty
function seedDefaultCredits(userId) {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM cloud_credits WHERE user_id = ?').get(userId).cnt;
  if (count === 0) {
    db.prepare(`
      INSERT INTO cloud_credits (user_id, provider, program_name, total_granted, remaining_amount, expiration_date)
      VALUES (?, 'AWS', 'AWS Activate Founders Credit Grant', 10000.00, 8450.00, '2026-12-31')
    `).run(userId);
    db.prepare(`
      INSERT INTO cloud_credits (user_id, provider, program_name, total_granted, remaining_amount, expiration_date)
      VALUES (?, 'Azure', 'Microsoft Azure Founders Hub', 5000.00, 4120.00, '2026-11-15')
    `).run(userId);
  }
}

// GET /api/credits - Fetch user's remaining cloud credits
router.get('/', authenticateToken, (req, res) => {
  try {
    seedDefaultCredits(req.user.id);

    const credits = db.prepare(`
      SELECT id, provider, program_name as programName, total_granted as totalGranted,
             remaining_amount as remainingAmount, expiration_date as expirationDate, created_at as createdAt
      FROM cloud_credits
      WHERE user_id = ?
    `).all(req.user.id);

    const totalGranted = credits.reduce((acc, c) => acc + c.totalGranted, 0);
    const totalRemaining = credits.reduce((acc, c) => acc + c.remainingAmount, 0);
    const usedAmount = parseFloat((totalGranted - totalRemaining).toFixed(2));
    const usagePercentage = totalGranted ? parseFloat(((usedAmount / totalGranted) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      summary: {
        totalGranted,
        totalRemaining: parseFloat(totalRemaining.toFixed(2)),
        usedAmount,
        usagePercentage,
        burnRateDaysRemaining: 74
      },
      credits
    });
  } catch (error) {
    console.error('Fetch credits error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cloud credits.' });
  }
});

// POST /api/credits - Update or add new cloud credit grant
router.post('/', authenticateToken, (req, res) => {
  try {
    const { provider, programName, totalGranted, remainingAmount, expirationDate } = req.body;

    if (!totalGranted || !remainingAmount) {
      return res.status(400).json({ success: false, message: 'Please provide total granted and remaining amount.' });
    }

    const stmt = db.prepare(`
      INSERT INTO cloud_credits (user_id, provider, program_name, total_granted, remaining_amount, expiration_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      req.user.id,
      provider || 'AWS',
      programName || 'Cloud Promotional Grant',
      parseFloat(totalGranted),
      parseFloat(remainingAmount),
      expirationDate || '2026-12-31'
    );

    res.status(201).json({
      success: true,
      message: 'Cloud credits grant updated successfully!',
      creditId: info.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cloud credits.' });
  }
});

module.exports = router;
