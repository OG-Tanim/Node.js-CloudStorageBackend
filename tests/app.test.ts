import request from 'supertest';
import app from '../src/app';

describe('App Bootstrapping', () => {
  it('should respond to ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Pong!');
  });
});
