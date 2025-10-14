const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/db');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {
  await pool.query('DELETE FROM devices');
});

afterAll(async () => {
  await pool.end();
});

describe('Devices API integration', () => {
  test('POST /api/devices creates device and GET /api/devices lists it', async () => {
    const payload = { name: 'Device A', mac: 'AA:BB:CC:DD' };
    const res1 = await request(app).post('/api/devices').send(payload);
    expect(res1.statusCode).toBe(201);
    expect(res1.body).toHaveProperty('id');
    expect(res1.body.name).toBe(payload.name);
    expect(res1.body.mac).toBe(payload.mac);

    const res2 = await request(app).get('/api/devices');
    expect(res2.statusCode).toBe(200);
    expect(Array.isArray(res2.body)).toBe(true);
    expect(res2.body.length).toBe(1);
  });

  test('PATCH /api/devices/:id/status toggles status', async () => {
    const { body } = await request(app).post('/api/devices').send({ name: 'D', mac: 'M1' });
    const id = body.id;
    const resToggle = await request(app).patch(`/api/devices/${id}/status`);
    expect(resToggle.statusCode).toBe(200);
    expect(['ATIVO','INATIVO']).toContain(resToggle.body.status);
  });

  test('POST duplicate mac returns 409', async () => {
    await request(app).post('/api/devices').send({ name: 'a', mac: 'XX' });
    const res = await request(app).post('/api/devices').send({ name: 'b', mac: 'XX' });
    expect(res.statusCode).toBe(409);
  });
});
