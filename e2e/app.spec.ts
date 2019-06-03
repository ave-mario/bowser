import request from 'supertest';
import server from '../src/app';

const agent = request.agent(server);

describe('GET /api/health', () => {
  it('It should respond with a 200 status', async () => {
    await agent.get('/api/health').expect(200);
  });
});
