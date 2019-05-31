import request from 'supertest';
import server from '../src/app';

const agent = request.agent(server);

describe('GET /api/health', () => {
  it('should return 200 OK', async () => {
    await agent.get('/api/health').expect(200);
  });
});
