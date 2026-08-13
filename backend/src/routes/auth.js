const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and full name.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, full_name, demo_mode)
      VALUES (?, ?, ?, 1)
    `);
    const info = stmt.run(email.toLowerCase().trim(), passwordHash, fullName.trim());

    // Create default budget
    db.prepare(`
      INSERT INTO budgets (user_id, category, monthly_limit, alert_threshold)
      VALUES (?, 'Overall Cloud Spending', 2500, 80)
    `).run(info.lastInsertRowid);

    // Audit log
    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      info.lastInsertRowid,
      'USER_REGISTER',
      `Account created for ${email}`
    );

    const token = jwt.sign({ id: info.lastInsertRowid, email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: info.lastInsertRowid,
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        demoMode: 1,
        awsConfigured: false,
        azureConfigured: false,
        gcpConfigured: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Wrong password.' });
    }

    // Audit log
    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      user.id,
      'USER_LOGIN',
      `Logged in from IP: ${req.ip || 'local'}`
    );

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        demoMode: user.demo_mode,
        awsRegion: user.aws_region,
        awsAccessKey: user.aws_access_key,
        awsSecretKey: user.aws_secret_key,
        azureClientId: user.azure_client_id,
        gcpProjectId: user.gcp_project_id,
        awsConfigured: Boolean(user.aws_access_key && user.aws_secret_key),
        azureConfigured: Boolean(user.azure_client_id),
        gcpConfigured: Boolean(user.gcp_project_id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(440).json({ success: false, message: 'User profile not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        awsRegion: user.aws_region,
        awsAccessKey: user.aws_access_key,
        awsSecretKey: user.aws_secret_key,
        azureClientId: user.azure_client_id,
        gcpProjectId: user.gcp_project_id,
        demoMode: user.demo_mode,
        awsConfigured: Boolean(user.aws_access_key && user.aws_secret_key),
        azureConfigured: Boolean(user.azure_client_id),
        gcpConfigured: Boolean(user.gcp_project_id),
        createdAt: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update profile & cloud platform API credentials
router.put('/settings', authenticateToken, (req, res) => {
  try {
    const {
      fullName,
      awsAccessKey,
      awsSecretKey,
      awsRegion,
      azureClientId,
      azureTenantId,
      azureSecret,
      gcpProjectId,
      gcpServiceKey,
      demoMode
    } = req.body;

    const currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    const updatedName = fullName !== undefined ? fullName : currentUser.full_name;
    const updatedAccessKey = awsAccessKey !== undefined ? awsAccessKey : currentUser.aws_access_key;
    const updatedSecretKey = awsSecretKey !== undefined ? awsSecretKey : currentUser.aws_secret_key;
    const updatedRegion = awsRegion !== undefined ? awsRegion : currentUser.aws_region;
    const updatedAzureClientId = azureClientId !== undefined ? azureClientId : currentUser.azure_client_id;
    const updatedAzureTenantId = azureTenantId !== undefined ? azureTenantId : currentUser.azure_tenant_id;
    const updatedAzureSecret = azureSecret !== undefined ? azureSecret : currentUser.azure_secret;
    const updatedGcpProjectId = gcpProjectId !== undefined ? gcpProjectId : currentUser.gcp_project_id;
    const updatedGcpServiceKey = gcpServiceKey !== undefined ? gcpServiceKey : currentUser.gcp_service_key;

    // Automatically turn off demo mode if credentials are provided
    const hasKeys = Boolean(updatedAccessKey || updatedAzureClientId || updatedGcpProjectId);
    const updatedDemoMode = hasKeys ? 0 : (demoMode !== undefined ? (demoMode ? 1 : 0) : currentUser.demo_mode);

    db.prepare(`
      UPDATE users
      SET full_name = ?, aws_access_key = ?, aws_secret_key = ?, aws_region = ?,
          azure_client_id = ?, azure_tenant_id = ?, azure_secret = ?,
          gcp_project_id = ?, gcp_service_key = ?, demo_mode = ?
      WHERE id = ?
    `).run(
      updatedName, updatedAccessKey, updatedSecretKey, updatedRegion,
      updatedAzureClientId, updatedAzureTenantId, updatedAzureSecret,
      updatedGcpProjectId, updatedGcpServiceKey, updatedDemoMode,
      req.user.id
    );

    db.prepare(`INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)`).run(
      req.user.id,
      'UPDATE_SETTINGS',
      `Saved credentials. Live Calculation Mode Active: ${hasKeys ? 'YES' : 'NO'}`
    );

    // Invalidate cost cache so newly updated API keys take effect immediately
    try {
      const costRoutes = require('./costs');
      if (costRoutes.clearCache) costRoutes.clearCache();
    } catch (err) {
      // ignore
    }

    res.json({
      success: true,
      message: 'Credentials saved! Calculating live cost metrics...',
      user: {
        id: req.user.id,
        email: currentUser.email,
        fullName: updatedName,
        awsRegion: updatedRegion,
        awsAccessKey: updatedAccessKey,
        awsSecretKey: updatedSecretKey,
        azureClientId: updatedAzureClientId,
        gcpProjectId: updatedGcpProjectId,
        demoMode: updatedDemoMode,
        awsConfigured: Boolean(updatedAccessKey && updatedSecretKey),
        azureConfigured: Boolean(updatedAzureClientId),
        gcpConfigured: Boolean(updatedGcpProjectId)
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
});

module.exports = router;
