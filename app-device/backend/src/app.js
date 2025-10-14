const express = require('express');
const cors = require('cors');
const devicesRouter = require('./routes/devices');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/devices', devicesRouter);

app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
