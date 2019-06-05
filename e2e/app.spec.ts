import request from 'supertest';
import server from '../src/app';

const agent = request.agent(server);

describe('Api healthchekc', () => {
  describe('GET /api/health', () => {
    it('It should responsed success with 200 status', async () => {
      await agent.get('/api/health').expect(200);
    });
  });
});
