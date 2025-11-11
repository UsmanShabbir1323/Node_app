const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Task = require('../models/Task');

// Mock Redis cache module with in-memory Map
jest.mock('../cache', () => {
  const store = new Map();
  return {
    get: async (key) => store.get(key) || null,
    set: async (key, value) => { store.set(key, value); },
    del: async (key) => { store.delete(key); },
  };
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('Tasks API', () => {
  test('GET /tasks/health returns 200', async () => {
    const res = await request(app).get('/tasks/health');
    expect(res.status).toBe(200);
  });

  test('POST /tasks creates a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task', description: 'desc' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  test('GET /tasks returns array', async () => {
    await Task.create({ title: 'A' });
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  test('GET /tasks/:id returns a task', async () => {
    const task = await Task.create({ title: 'Item' });
    const res = await request(app).get(`/tasks/${task._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Item');
  });

  test('PUT /tasks/:id updates a task', async () => {
    const task = await Task.create({ title: 'Old' });
    const res = await request(app)
      .put(`/tasks/${task._id.toString()}`)
      .send({ title: 'New' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New');
  });

  test('DELETE /tasks/:id deletes a task', async () => {
    const task = await Task.create({ title: 'Del' });
    const res = await request(app).delete(`/tasks/${task._id.toString()}`);
    expect(res.status).toBe(200);
  });
});


