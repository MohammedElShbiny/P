const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const contactRoutes = require('./routes/contact');
const projectsRoutes = require('./routes/projects');
const servicesRoutes = require('./routes/services');
const messagesRoutes = require('./routes/messages');

app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api', messagesRoutes);

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'demo2024';

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }
  const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [user, pass] = decoded.split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return next();
  }
  return res.status(403).json({ error: 'Invalid credentials.' });
}

function rowsToArray(result) {
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    cols.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

app.get('/api/admin/inquiries', adminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(rowsToArray(result));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

app.put('/api/admin/inquiries/:id', adminAuth, async (req, res) => {
  try {
    const db = await getDb();
    db.run('UPDATE inquiries SET status=? WHERE id=?', [req.body.status, req.params.id]);
    const { saveDb } = require('./db');
    saveDb();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

app.get('/api/stats', adminAuth, async (req, res) => {
  try {
    const db = await getDb();
    const inquiries = db.exec('SELECT COUNT(*) as cnt FROM inquiries');
    const projects = db.exec('SELECT COUNT(*) as cnt FROM projects');
    const services = db.exec('SELECT COUNT(*) as cnt FROM services');
    const newInquiries = db.exec("SELECT COUNT(*) as cnt FROM inquiries WHERE status='new'");
    res.json({
      total_inquiries: inquiries[0]?.values[0][0] || 0,
      total_projects: projects[0]?.values[0][0] || 0,
      total_services: services[0]?.values[0][0] || 0,
      new_inquiries: newInquiries[0]?.values[0][0] || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
  await getDb();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin dashboard at http://localhost:${PORT}/admin`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
