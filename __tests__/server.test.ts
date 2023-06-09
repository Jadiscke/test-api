import { createServer } from '../src/server';
import request from 'supertest';
import { Server } from 'http';

describe('Server', () => {
  let server: Server;

  beforeAll(() => {
    server = createServer().listen();
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return "Hello World!" when accessing the root endpoint', async () => {
    const response = await request(server).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello World!'});
  });

  describe('API Routes', () => {
    it('should return 404 status code when accessing an unknown endpoint', async () => {
      const response = await request(server).get('/api/unknown');

      expect(response.status).toBe(404);
    });
  });
});

