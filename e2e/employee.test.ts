import { IEmployeeToLogin, IEmployeeFieldsToRegister } from '../src/interfaces';
import request from 'supertest';
import server from '../src/app';

const agent = request.agent(server);

let token = '';
const newEmployee: IEmployeeFieldsToRegister = {
  name: 'Aiden',
  surname: 'Anderson',
  patronymic: 'Bahringer',
  email: 'Aiden.Anderson.2019@mail.ru',
  phoneNumber: '+375295106978',
  address: 'Lake Kamille, 897 Stoltenberg Tunnel'
};

describe('Employee routes', () => {
  describe('POST /api/employees is registration', () => {
    it('When this client already exist with email status 400', () => {
      agent
        .post('/api/employees/')
        .send(newEmployee)
        .expect(400);
    });
    it('When not have this client status 201', () => {
      agent
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);
    });

    it('When not have address: status 400', () => {
      const employeeWithouAddress = newEmployee;
      delete employeeWithouAddress.address;
      agent
        .post('/api/employees/')
        .send(employeeWithouAddress)
        .expect(400);
    });
  });

  describe('POST /api/employees/login', () => {
    it('When user is exist:  status 200', async () => {
      const client: IEmployeeToLogin = {
        email: newEmployee.email,
        password: '12345QWE'
      };
      await agent
        .post('/api/employees/login')
        .send(client)
        .expect(200)
        .then(response => {
          token = response.body.tokens.accessToken;
        });
    });
  });

  describe('GET /api/employees/current', () => {
    it('Better: Token is not valid: status 200', () => {
      agent
        .get('/api/employees/current')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);
    });
  });
});
