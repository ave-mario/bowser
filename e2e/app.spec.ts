import request from 'supertest';
import app from '../src/app';
import { TestClient } from './client.test';
import { TestEmployee } from './employee.test';

const agent = request.agent(app);
jest.setTimeout(3000);

describe('GET /api/health', () => {
  it('It should response have status 200', async () => {
    await agent.get('/api/health').expect(200);
  });
});

new TestClient(agent).startTets();
new TestEmployee(agent).startTets();
