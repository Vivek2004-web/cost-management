const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/alerts - List configured email notification recipients
router.get('/', authenticateToken, (req, res) => {
  try {
    const emails = db.prepare(`
      SELECT id, name, url_or_email as email, enabled, created_at as createdAt
      FROM alert_webhooks
      WHERE user_id = ?
    `).all(req.user.id);

    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch email alert recipients.' });
  }
});

// POST /api/alerts - Add new Email Alert recipient
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide recipient name and email address.' });
    }

    const stmt = db.prepare(`
      INSERT INTO alert_webhooks (user_id, type, name, url_or_email, enabled)
      VALUES (?, 'Email', ?, ?, 1)
    `);
    const info = stmt.run(req.user.id, name, email);

    res.status(201).json({
      success: true,
      message: `Email alert recipient (${email}) added successfully!`,
      emailId: info.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save email recipient.' });
  }
});

// POST /api/alerts/test - Send simulated email notification
router.post('/test', authenticateToken, (req, res) => {
  try {
    const { email } = req.body;
    
    // Audit log
    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      req.user.id,
      'TEST_EMAIL_ALERT',
      `Dispatched test email notification to ${email || 'configured recipient'}`
    );

    res.json({
      success: true,
      message: `📧 Test alert email sent to ${email || 'recipient'}! Content: "Subject: [CloudOps Alert] Budget usage reached 90%. Estimated month-end spend: ₹45,500."`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to dispatch test email.' });
  }
});

// DELETE /api/alerts/:id - Remove email recipient
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM alert_webhooks WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true, message: 'Email recipient removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete email recipient.' });
  }
});

module.exports = router;
