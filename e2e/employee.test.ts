/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { IEmployeeFieldsToRegister, IEmployeeToLogin } from '../src/interfaces';
import request from 'supertest';

export class TestEmployee {
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
    describe('POST /api/employees is registration', () => {
      describe('if the all field not valid', () => {
        it('It should response have status 201', async () => {
          const client: IEmployeeFieldsToRegister = {
            name: 'Aiden',
            surname: 'Anderson',
            patronymic: 'Bahringer',
            email: 'Aiden.Anderson.6@mail.ru',
            phoneNumber: '+375295108429',
            address: 'Malawi, East Felipamouth, 324 Anita Plaza'
          };
          await this._agent
            .post('/api/employees/')
            .send(client)
            .expect(201);
        });
      });

      describe('if not have address', () => {
        it('It should response have status 400', async () => {
          const client = {
            name: 'Aiden',
            surname: 'Anderson',
            patronymic: 'Bahringer',
            email: 'Aiden.Anderson.ru',
            phoneNumber: '+375295108429'
          };
          await this._agent
            .post('/api/employees/')
            .send(client)
            .expect(400);
        });
      });
    });
  }

  private testLogin(): void {
    describe('POST /api/employees/login', () => {
      describe('if the phoneNumber is valid', () => {
        it('It should response have status 200', async () => {
          const client: IEmployeeToLogin = {
            email: 'Aiden.Anderson.6@mail.ru',
            password: '123456QWE'
          };
          await this._agent
            .post('/api/employees/login')
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
    describe('GET /api/employees/current', () => {
      describe('the token is', () => {
        it('valid: It should response have status 401', async () => {
          await this._agent
            .get('/api/employees/current')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I')
            .expect(401);
        });
        it('not valid: It should response have status 200', async () => {
          await this._agent
            .get('/api/employees/current')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this._token)
            .expect(200);
        });
      });
    });
  }
}
