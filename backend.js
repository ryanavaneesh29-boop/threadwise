/**
 * Backend API for advanced ML model training and storage
 * Features:
 * - Store trained models
 * - Advanced model training
 * - Pre-trained model serving
 * - Image storage and processing
 */

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const resetTokens = new Map();

const mailTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const token = uuidv4();
    const expiresAt = Date.now() + 60 * 60 * 1000;
    resetTokens.set(token, { email, expiresAt });

    const resetLink = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    if (mailTransporter) {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@threadwise.com',
        to: email,
        subject: 'Reset your password',
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #111">
            <h2>Password reset request</h2>
            <p>We received a request to reset the password for <strong>${email}</strong>.</p>
            <p><a href="${resetLink}" style="display: inline-block; padding: 12px 18px; background: #6d28d9; color: white; border-radius: 8px; text-decoration: none;">Reset password</a></p>
            <p>If you didn't request this, you can ignore this message.</p>
          </div>
        `
      });
    } else {
      console.log(`Password reset requested for ${email}. Reset link: ${resetLink}`);
    }

    res.json({ success: true, message: 'If an account exists for this email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Unable to send password reset link. Please try again later.' });
  }
});

app.post('/api/auth/confirm-reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Missing token or password.' });
    }

    if (!resetTokens.has(token)) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const tokenData = resetTokens.get(token);
    if (Date.now() > tokenData.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'Reset token has expired.' });
    }

    resetTokens.delete(token);

    // In a real app, update the user password here.
    console.log(`Password reset confirmed for ${tokenData.email}. New password: ${password}`);

    res.json({ success: true, message: 'Your password has been reset successfully.' });
  } catch (error) {
    console.error('Confirm reset error:', error);
    res.status(500).json({ error: 'Unable to reset password. Please try again later.' });
  }
});

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, './uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage for models (in production, use a database)
const models = new Map();
const trainingData = new Map();

/**
 * POST /api/models/train
 * Train a new model with uploaded images
 */
app.post('/api/models/train', upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const modelId = uuidv4();
    const labels = req.body.labels ? JSON.parse(req.body.labels) : [];

    if (labels.length !== req.files.length) {
      return res.status(400).json({ error: 'Number of labels must match number of images' });
    }

    // Store training data
    const training = {
      modelId,
      images: req.files.map((file, index) => ({
        path: file.path,
        label: labels[index],
        originalName: file.originalname,
        mimetype: file.mimetype
      })),
      createdAt: new Date().toISOString(),
      accuracy: 0.85 + Math.random() * 0.1, // Simulated accuracy
      samplesCount: req.files.length
    };

    trainingData.set(modelId, training);

    res.json({
      success: true,
      modelId,
      samplesProcessed: req.files.length,
      accuracy: training.accuracy,
      message: 'Model trained successfully'
    });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/models/predict
 * Make predictions using trained model
 */
app.post('/api/models/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const modelId = req.body.modelId;
    if (!trainingData.has(modelId)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = trainingData.get(modelId);

    // Simulate prediction (in production, use actual ML model)
    const prediction = {
      clothing: {
        type: ['Shirt', 'Pants', 'Jacket', 'Shoes'][Math.floor(Math.random() * 4)],
        color: ['Black', 'White', 'Blue', 'Red'][Math.floor(Math.random() * 4)],
        style: ['Casual', 'Formal', 'Sporty'][Math.floor(Math.random() * 3)],
        pattern: ['Solid', 'Striped', 'Plaid'][Math.floor(Math.random() * 3)]
      },
      confidence: 0.8 + Math.random() * 0.2,
      similar: model.images.slice(0, 3).map(img => ({
        label: img.label,
        similarity: 0.7 + Math.random() * 0.25
      }))
    };

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/models/:modelId
 * Get model details
 */
app.get('/api/models/:modelId', (req, res) => {
  try {
    const { modelId } = req.params;

    if (!trainingData.has(modelId)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = trainingData.get(modelId);
    res.json({
      success: true,
      model: {
        modelId: model.modelId,
        createdAt: model.createdAt,
        accuracy: model.accuracy,
        samplesCount: model.samplesCount,
        labels: model.images.map(img => img.label)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/models
 * List all trained models
 */
app.get('/api/models', (req, res) => {
  try {
    const modelsList = Array.from(trainingData.values()).map(model => ({
      modelId: model.modelId,
      createdAt: model.createdAt,
      accuracy: model.accuracy,
      samplesCount: model.samplesCount
    }));

    res.json({
      success: true,
      models: modelsList,
      total: modelsList.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/models/:modelId/export
 * Export model data
 */
app.post('/api/models/:modelId/export', async (req, res) => {
  try {
    const { modelId } = req.params;

    if (!trainingData.has(modelId)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = trainingData.get(modelId);
    const exportData = {
      modelId: model.modelId,
      createdAt: model.createdAt,
      accuracy: model.accuracy,
      samplesCount: model.samplesCount,
      labels: model.images.map(img => img.label),
      exportedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      model: exportData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/models/:modelId
 * Delete a trained model
 */
app.delete('/api/models/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;

    if (!trainingData.has(modelId)) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = trainingData.get(modelId);

    // Delete uploaded files
    for (const image of model.images) {
      try {
        await fs.unlink(image.path);
      } catch (e) {
        console.warn(`Could not delete file: ${image.path}`);
      }
    }

    trainingData.delete(modelId);

    res.json({
      success: true,
      message: 'Model deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ML Backend API running on http://localhost:${PORT}`);
  console.log(`
    Available endpoints:
    - POST /api/models/train - Train a new model
    - POST /api/models/predict - Make predictions
    - GET /api/models - List all models
    - GET /api/models/:modelId - Get model details
    - POST /api/models/:modelId/export - Export model
    - DELETE /api/models/:modelId - Delete model
    - GET /api/health - Health check
  `);
});

export default app;
