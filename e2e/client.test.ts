/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { IClientFieldsToRegister, IClientToLogin } from '../src/interfaces';
import request from 'supertest';

export class TestClient {
  private _agent: request.SuperTest<request.Test>;
  private _token: string;

  constructor(agent: request.SuperTest<request.Test>) {
    this._agent = agent;
  }

  public startTets() {
    describe('The client path', () => {
      this.testRegister();
      this.testLogin();
      this.testGetUSer();
    });
  }

  private testRegister(): void {
    describe('POST /api/clients is registration', () => {
      describe('if the fields is not valid', () => {
        it('It should response have status 201', async () => {
          const client: IClientFieldsToRegister = {
            name: 'Rosie',
            surname: 'Langosh',
            email: 'Rosie.Langosh@gmail.com',
            phoneNumber: '+375336776452'
          };
          await this._agent
            .post('/api/clients/')
            .send(client)
            .expect(201);
        });
      });
    });
  }

  private testLogin(): void {
    describe('POST /api/clients/login', () => {
      describe('if the phoneNumber is valid', () => {
        it('It should response have status 200', async () => {
          const client: IClientToLogin = {
            phoneNumber: '+375336776452',
            loginCode: '123456'
          };
          await this._agent
            .post('/api/clients/login')
            .send(client)
            .expect(200)
            .then(response => {
              this._token = response.body.tokens.accessToken;
            });
        });
      });
    });
  }

  private testGetUSer(): void {
    describe('GET /api/clients/current', () => {
      describe('the token is', () => {
        it('valid: It should response have status 401', async () => {
          await this._agent
            .get('/api/clients/current')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I')
            .expect(401);
        });
        it('not valid: It should response have status 200', async () => {
          await this._agent
            .get('/api/clients/current')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this._token)
            .expect(200);
        });
      });
    });
  }
}
