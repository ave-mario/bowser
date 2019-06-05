import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { IClientFieldsToRegister, IClientToLogin } from '../src/interfaces';
import { Client } from '../src/models';

const agent = request.agent(server);

describe('Client routes', () => {
  let token = '';
  const newClient: IClientFieldsToRegister = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('+375#########')
  };
  console.log(newClient);

  describe('POST /api/clients', () => {
    it("When email is wrong then service don't to add new client", async () => {
      const client = {
        name: newClient.name,
        surname: newClient.surname,
        email: faker.name.firstName(),
        phoneNumber: newClient.phoneNumber
      };
      client.email = faker.name.firstName();
      await agent
        .post('/api/clients/')
        .send(client)
        .expect(400, {
          message: '"email" must be a valid email',
          success: false
        });
    });

    it('when all data is correct then the client is added success', async () => {
      await agent
        .post('/api/clients/')
        .send(newClient)
        .expect(201, { success: true });
    });

    it('when email or phone is already registered then get error', async () => {
      await agent
        .post('/api/clients/')
        .send(newClient)
        .expect(400)
        .expect(res => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('message', expect.any(String));
        });
    });
  });

  describe('POST /api/clients/login', () => {
    it('when client with phone is exist then the response have tokens and own user', async () => {
      const user = await Client.findOne({ phoneNumber: newClient.phoneNumber })
        .select('loginCode')
        .exec();
      const client: IClientToLogin = {
        phoneNumber: newClient.phoneNumber,
        loginCode: user
          ? user.loginCode
          : faker.random.number({ min: 100000, max: 1000000 })
      };
      console.log(client);

      const res = await agent
        .post('/api/clients/login')
        .send(client)
        .expect(200);

      token = res.body.tokens.accessToken;
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('tokens', { accessToken: expect.any(String) });
      expect(res.body).toHaveProperty('user', expect.any(Object));
    });
  });

  describe('GET /api/clients/current', () => {
    it('when token is wrong then response return status Forbidden', () => {
      agent
        .get('/api/clients/current')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I')
        .expect(401);
    });
    it('when token is valid then response return current user', () => {
      agent
        .get('/api/clients/current')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('user', expect.any(Object));
        });
    });
  });
});
