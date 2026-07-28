const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Seed initial default checklist tasks if empty
function seedDefaultChecklist(userId) {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM optimization_checklist WHERE user_id = ?').get(userId).cnt;
  if (count === 0) {
    const defaultTasks = [
      { name: 'Delete unattached EBS volumes (1.2 TB idle)', category: 'AWS Storage', savings: 1850, impact: 'HIGH' },
      { name: 'Remove unused Elastic IP addresses (3 static IPs)', category: 'AWS Networking', savings: 650, impact: 'MEDIUM' },
      { name: 'Stop idle t3.large EC2 instances during weekends', category: 'AWS Compute', savings: 3200, impact: 'HIGH' },
      { name: 'Clean old S3 lifecycle bucket snapshots (> 180 days)', category: 'AWS Storage', savings: 1400, impact: 'MEDIUM' },
      { name: 'Purge orphaned Azure Managed SSD Disks (500 GB)', category: 'Azure Storage', savings: 2100, impact: 'HIGH' },
      { name: 'Downsize unused GCP BigQuery slots', category: 'GCP Analytics', savings: 1900, impact: 'MEDIUM' }
    ];

    const stmt = db.prepare(`
      INSERT INTO optimization_checklist (user_id, task_name, category, estimated_savings, impact, is_completed)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    defaultTasks.forEach(t => {
      stmt.run(userId, t.name, t.category, t.savings, t.impact);
    });
  }
}

// GET /api/checklist
router.get('/', authenticateToken, (req, res) => {
  try {
    seedDefaultChecklist(req.user.id);

    const tasks = db.prepare(`
      SELECT id, task_name as taskName, category, estimated_savings as estimatedSavings, impact, is_completed as isCompleted, created_at as createdAt
      FROM optimization_checklist
      WHERE user_id = ?
      ORDER BY is_completed ASC, estimated_savings DESC
    `).all(req.user.id);

    const totalPotentialSavings = tasks.reduce((acc, t) => acc + t.estimatedSavings, 0);
    const completedSavings = tasks.filter(t => t.isCompleted === 1).reduce((acc, t) => acc + t.estimatedSavings, 0);
    const completedCount = tasks.filter(t => t.isCompleted === 1).length;

    res.json({
      success: true,
      tasks,
      summary: {
        totalTasks: tasks.length,
        completedCount,
        progressPercentage: tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
        totalPotentialSavings,
        completedSavings
      }
    });
  } catch (error) {
    console.error('Checklist GET error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch daily optimization checklist.' });
  }
});

// PUT /api/checklist/:id/toggle - Toggle checklist task completed state
router.put('/:id/toggle', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const task = db.prepare('SELECT * FROM optimization_checklist WHERE id = ? AND user_id = ?').get(id, req.user.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Checklist task not found.' });
    }

    const newStatus = task.is_completed === 1 ? 0 : 1;
    db.prepare('UPDATE optimization_checklist SET is_completed = ? WHERE id = ?').run(newStatus, id);

    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      req.user.id,
      'CHECKLIST_TOGGLE',
      `Toggled task "${task.task_name}" to ${newStatus ? 'COMPLETED' : 'PENDING'}`
    );

    res.json({ success: true, message: 'Task status updated.', isCompleted: newStatus === 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task status.' });
  }
});

module.exports = router;
