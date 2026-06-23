const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

function rowsToArray(result) {
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    cols.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, pass] = decoded.split(':');
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'demo2024';
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return next();
  }
  return res.status(403).json({ error: 'Invalid credentials.' });
}

async function validateToken(token) {
  const db = await getDb();
  const result = db.exec('SELECT id, name, email FROM inquiries WHERE session_token = ?', [token]);
  if (!result.length || !result[0].values.length) return null;
  const cols = result[0].columns;
  const row = result[0].values[0];
  const obj = {};
  cols.forEach((col, i) => { obj[col] = row[i]; });
  return obj;
}

// User: lookup inquiry by email
router.get('/lookup', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !email.trim()) return res.status(400).json({ success: false, error: 'Email is required.' });
    const db = await getDb();
    const result = db.exec('SELECT session_token FROM inquiries WHERE LOWER(email) = LOWER(?) LIMIT 1', [email.trim()]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ success: false, error: 'No inquiry found for this email.' });
    }
    const token = result[0].values[0][0];
    res.json({ success: true, token });
  } catch (err) {
    console.error('Lookup error:', err);
    res.status(500).json({ success: false, error: 'Failed to lookup inquiry.' });
  }
});

// User: get messages
router.get('/chat/:token', async (req, res) => {
  try {
    const inquiry = await validateToken(req.params.token);
    if (!inquiry) return res.status(404).json({ error: 'Invalid session token.' });
    const db = await getDb();
    const result = db.exec('SELECT * FROM messages WHERE inquiry_id = ? ORDER BY created_at ASC', [inquiry.id]);
    res.json({ inquiry, messages: rowsToArray(result) });
  } catch (err) {
    console.error('Chat GET error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// User: send message
router.post('/chat/:token', async (req, res) => {
  try {
    const inquiry = await validateToken(req.params.token);
    if (!inquiry) return res.status(404).json({ error: 'Invalid session token.' });
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required.' });
    const db = await getDb();
    db.run('INSERT INTO messages (inquiry_id, sender, message) VALUES (?, ?, ?)', [inquiry.id, 'user', message.trim()]);
    saveDb();
    const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Chat POST error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// User: poll for unread
router.get('/chat/:token/unread', async (req, res) => {
  try {
    const inquiry = await validateToken(req.params.token);
    if (!inquiry) return res.status(404).json({ error: 'Invalid session token.' });
    const db = await getDb();
    const result = db.exec("SELECT * FROM messages WHERE inquiry_id = ? AND sender = 'admin' AND is_read = 0 ORDER BY created_at ASC", [inquiry.id]);
    const unread = rowsToArray(result);
    if (unread.length > 0) {
      const ids = unread.map(m => m.id).join(',');
      db.run(`UPDATE messages SET is_read = 1 WHERE id IN (${ids})`);
      saveDb();
    }
    res.json({ unread });
  } catch (err) {
    console.error('Chat unread error:', err);
    res.status(500).json({ error: 'Failed to check unread messages.' });
  }
});

// Admin: list all conversations
router.get('/admin/messages', adminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec(`
      SELECT i.id as inquiry_id, i.name, i.email, i.session_token,
        (SELECT message FROM messages WHERE inquiry_id = i.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT sender FROM messages WHERE inquiry_id = i.id ORDER BY created_at DESC LIMIT 1) as last_sender,
        (SELECT created_at FROM messages WHERE inquiry_id = i.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
        (SELECT COUNT(*) FROM messages WHERE inquiry_id = i.id AND sender = 'user' AND is_read = 0) as unread_count
      FROM inquiries i
      ORDER BY last_message_at DESC NULLS LAST
    `);
    res.json(rowsToArray(result));
  } catch (err) {
    console.error('Admin messages list error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

// Admin: get messages for specific inquiry
router.get('/admin/messages/:inquiryId', adminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const inquiryResult = db.exec('SELECT id, name, email FROM inquiries WHERE id = ?', [req.params.inquiryId]);
    if (!inquiryResult.length || !inquiryResult[0].values.length) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    const cols = inquiryResult[0].columns;
    const row = inquiryResult[0].values[0];
    const inquiry = {};
    cols.forEach((col, i) => { inquiry[col] = row[i]; });

    const messages = db.exec('SELECT * FROM messages WHERE inquiry_id = ? ORDER BY created_at ASC', [req.params.inquiryId]);
    res.json({ inquiry, messages: rowsToArray(messages) });
  } catch (err) {
    console.error('Admin messages get error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Admin: send message
router.post('/admin/messages/:inquiryId', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required.' });
    const db = await getDb();
    const exists = db.exec('SELECT id FROM inquiries WHERE id = ?', [req.params.inquiryId]);
    if (!exists.length || !exists[0].values.length) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    db.run('INSERT INTO messages (inquiry_id, sender, message) VALUES (?, ?, ?)', [req.params.inquiryId, 'admin', message.trim()]);
    saveDb();
    const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Admin message send error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
