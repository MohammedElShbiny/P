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
    const result = db.exec('SELECT * FROM services ORDER BY sort_order ASC');
    const services = rowsToArray(result);
    res.json(services);
  } catch (err) {
    console.error('Services GET error:', err);
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name_en, name_ar, price_egp, description_en, description_ar, features_en, features_ar, is_popular, sort_order } = req.body;
    if (!name_en || !name_ar || !price_egp) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }
    const db = await getDb();
    db.run(
      `INSERT INTO services (name_en, name_ar, price_egp, description_en, description_ar, features_en, features_ar, is_popular, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_ar, price_egp, description_en || '', description_ar || '', JSON.stringify(features_en || []), JSON.stringify(features_ar || []), is_popular ? 1 : 0, sort_order || 0]
    );
    saveDb();
    const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Services POST error:', err);
    res.status(500).json({ error: 'Failed to create service.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_ar, price_egp, description_en, description_ar, features_en, features_ar, is_popular, sort_order } = req.body;
    const db = await getDb();
    db.run(
      `UPDATE services SET name_en=?, name_ar=?, price_egp=?, description_en=?, description_ar=?, features_en=?, features_ar=?, is_popular=?, sort_order=? WHERE id=?`,
      [name_en, name_ar, price_egp, description_en, description_ar, JSON.stringify(features_en || []), JSON.stringify(features_ar || []), is_popular ? 1 : 0, sort_order, id]
    );
    saveDb();
    res.json({ success: true });
  } catch (err) {
    console.error('Services PUT error:', err);
    res.status(500).json({ error: 'Failed to update service.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM services WHERE id=?', [req.params.id]);
    saveDb();
    res.json({ success: true });
  } catch (err) {
    console.error('Services DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete service.' });
  }
});

module.exports = router;
