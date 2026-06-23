const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb, saveDb } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { name, email, project_type, budget, message } = req.body;
    if (!name || !email || !project_type || !message) {
      return res.status(400).json({ error: 'Name, email, project type, and message are required.' });
    }
    const db = await getDb();
    const token = crypto.randomUUID();
    db.run(
      'INSERT INTO inquiries (name, email, project_type, budget, message, session_token) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, project_type, budget || '', message, token]
    );
    saveDb();

    const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];

    res.status(201).json({ success: true, id, token, message: 'Inquiry submitted successfully.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

module.exports = router;
