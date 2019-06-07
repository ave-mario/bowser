import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { IClientFieldsToRegister, IClientToLogin } from '../src/interfaces';
import { Client } from '../src/models';
import { StatusUsers, CountAttempt } from '../src/enums';
import { logicErr } from '../src/errors';

const agent = request.agent(server);

describe('Client routes', () => {
  let accessToken: string, refreshToken: string;
  const newClient: IClientFieldsToRegister = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('+375#########')
  };

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

  describe('POST /api/clients/code', () => {
    it('when send code after register & user with phone is exist then set new login code', async () => {
      await agent
        .post('/api/clients/code')
        .send({ phoneNumber: newClient.phoneNumber })
        .expect(200, { success: true });
    });
  });

  const user: IClientToLogin = {
    phoneNumber: newClient.phoneNumber,
    loginCode: faker.random.number({ min: 100000, max: 1000000 })
  };
  describe('POST /api/clients/login', () => {
    it('when client with phone is exist then the response have tokens and own user', async () => {
      const data = await Client.findOne({ phoneNumber: newClient.phoneNumber })
        .select('loginCode')
        .exec();
      user.loginCode = data.loginCode;
      const res = await agent
        .post('/api/clients/login')
        .send(user)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('tokens', {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      });
      expect(res.body).toHaveProperty('user', expect.any(Object));
      accessToken = res.body.tokens.accessToken;
      refreshToken = res.body.tokens.refreshToken;
    });
  });
  describe('POST /api/auth/refresh-tokens', () => {
    it('when send refresh token valid then return new access and refresh tokens', async () => {
      const res = await agent
        .post('/api/auth/refresh-tokens')
        .set('Authorization', 'Bearer ' + refreshToken)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('tokens', {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      });
      accessToken = res.body.tokens.accessToken;
      refreshToken = res.body.tokens.refreshToken;
    });
  });
  describe('POST /api/clients/login', () => {
    it('when the user entered incorrectly 4 entry codes then he is blocked', async () => {
      let message = logicErr.wrongCodeToLogin.msg;

      const attempts: number[] = Array.from(
        { length: CountAttempt.loginClient + 1 },
        (x, i) => i
      );

      for (let attempt of attempts) {
        if (attempt === CountAttempt.loginClient) {
          message = logicErr.userBloking.msg;
        }

        await agent
          .post('/api/clients/login')
          .send(user)
          .expect(400, { success: false, message });
      }

      const client = await Client.findOne({ phoneNumber: newClient.phoneNumber });

      expect(client.attemptLogin).toBe(0);
      expect(client.status).toBe(StatusUsers.Bloking);
    });
  });

  describe('POST /api/clients/code', () => {
    it('when send code after bloking user then error send', async () => {
      await agent
        .post('/api/clients/code')
        .send({ phoneNumber: newClient.phoneNumber })
        .expect(400, { success: false, message: logicErr.userBloking.msg });
    });
  });

  describe('GET /api/clients/current', () => {
    it('when token is wrong then response return status Forbidden', () => {
      agent
        .get('/api/clients/current')
        .set('Authorization', 'Bearer ' + faker.hacker.abbreviation())
        .expect(401);
    });

    it('when token is valid then response return current user', () => {
      agent
        .get('/api/clients/current')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('user', expect.any(Object));
        });
    });
  });
});
