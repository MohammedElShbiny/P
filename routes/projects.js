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

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM projects ORDER BY sort_order ASC');
    const projects = rowsToArray(result);
    res.json(projects);
  } catch (err) {
    console.error('Projects GET error:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title_en, title_ar, description_en, description_ar, status, gradient, icon, tech_stack, github_url, demo_url, sort_order } = req.body;
    if (!title_en || !title_ar || !description_en || !description_ar) {
      return res.status(400).json({ error: 'Title and description in both languages are required.' });
    }
    const db = await getDb();
    db.run(
      `INSERT INTO projects (title_en, title_ar, description_en, description_ar, status, gradient, icon, tech_stack, github_url, demo_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_ar, description_en, description_ar, status || 'live', gradient || 'linear-gradient(135deg,#0070f3 0%,#7759fb 100%)', icon || 'code', JSON.stringify(tech_stack || []), github_url || '#', demo_url || '#', sort_order || 0]
    );
    saveDb();
    const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Projects POST error:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title_en, title_ar, description_en, description_ar, status, gradient, icon, tech_stack, github_url, demo_url, sort_order } = req.body;
    const db = await getDb();
    db.run(
      `UPDATE projects SET title_en=?, title_ar=?, description_en=?, description_ar=?, status=?, gradient=?, icon=?, tech_stack=?, github_url=?, demo_url=?, sort_order=? WHERE id=?`,
      [title_en, title_ar, description_en, description_ar, status, gradient, icon, JSON.stringify(tech_stack || []), github_url, demo_url, sort_order, id]
    );
    saveDb();
    res.json({ success: true });
  } catch (err) {
    console.error('Projects PUT error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM projects WHERE id=?', [req.params.id]);
    saveDb();
    res.json({ success: true });
  } catch (err) {
    console.error('Projects DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
