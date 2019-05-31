import { IClientFieldsToRegister, IClientToLogin } from '../src/interfaces';
import request from 'supertest';
import server from '../src/app';

const agent = request.agent(server);

let token = '';
const newClient: IClientFieldsToRegister = {
  name: 'Rosie',
  surname: 'Langosh',
  email: 'Rosie.Langosh@gmail.com',
  phoneNumber: '+375336776452'
};

describe('Client routes', () => {
  describe('POST /api/clients is registration', () => {
    it('When this client already exist with email status 400', () => {
      agent
        .post('/api/clients/')
        .send(newClient)
        .expect(400);
    });

    it('When valid phone: status 400', () => {
      const clietn = newClient;
      clietn.phoneNumber = '+37525855';
      agent
        .post('/api/clients/')
        .send(clietn)
        .expect(400);
    });

    it('When not have client status 201', async () => {
      await agent
        .post('/api/clients/')
        .send(newClient)
        .expect(201);
    });
  });

  describe('POST /api/clients/login', () => {
    it('Better: When the phoneNumber and code is right than status 200', async () => {
      const client: IClientToLogin = {
        phoneNumber: newClient.phoneNumber,
        loginCode: '123456'
      };
      await agent
        .post('/api/clients/login')
        .send(client)
        .expect(200)
        .then(response => {
          token = response.body.tokens.accessToken;
        });
    });
  });

  describe('GET /api/clients/current', () => {
    it('Wrong: Whan the token is valid: status 401', async () => {
      await agent
        .get('/api/clients/current')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I')
        .expect(401);
    });
    it('Better: Token is not valid: status 200', async () => {
      await agent
        .get('/api/clients/current')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);
    });
  });
});
