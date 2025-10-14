const express = require('express');
const router = express.Router();
const pool = require('../db');
const { emit } = require('../sockets');

// Helper: validate payload
function validateDeviceInput(body) {
  const errors = [];
  if (!body.name || String(body.name).trim() === '') errors.push('name is required');
  if (!body.mac || String(body.mac).trim() === '') errors.push('mac is required');
  return errors;
}

// POST /api/devices
router.post('/', async (req, res) => {
  try {
    const { name, mac } = req.body;
    const errs = validateDeviceInput(req.body);
    if (errs.length) return res.status(400).json({ errors: errs });

    // check duplicate mac
    const [rows] = await pool.query('SELECT id FROM devices WHERE mac = ?', [mac]);
    if (rows.length) return res.status(409).json({ error: 'mac already exists' });

    const [result] = await pool.query('INSERT INTO devices (name, mac) VALUES (?, ?)', [name, mac]);
    const [createdRows] = await pool.query('SELECT * FROM devices WHERE id = ?', [result.insertId]);
    const device = createdRows[0];

    // emit socket event
    emit('device:created', device);

    return res.status(201).json(device);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

// GET /api/devices
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM devices ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

// PATCH /api/devices/:id/status -> toggle between ATIVO / INATIVO
router.patch('/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    const [rows] = await pool.query('SELECT id, status FROM devices WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'device not found' });

    const current = rows[0].status;
    const next = current === 'ATIVO' ? 'INATIVO' : 'ATIVO';

    await pool.query('UPDATE devices SET status = ? WHERE id = ?', [next, id]);
    const [updatedRows] = await pool.query('SELECT * FROM devices WHERE id = ?', [id]);
    const device = updatedRows[0];

    // emit socket event with changed device or minimal info
    emit('device:status', { id: device.id, status: device.status });

    return res.json(device);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

module.exports = router;
