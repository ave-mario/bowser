import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { IEmployeeToLogin, IEmployeeFieldsToRegister } from '../src/interfaces';
import { Employee } from '../src/models';

const agent = request.agent(server);

describe('Employee routes', () => {
  let token = '';
  const newEmployee: IEmployeeFieldsToRegister = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    patronymic: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('+375#########'),
    address: `${faker.address.country()}, ${faker.address.city()}, ${faker.address.streetAddress()}`
  };
  console.log(newEmployee);

  describe('POST /api/employees is registration', () => {
    it('when success create new employee:response have status 201', async () => {
      await agent
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const user = await Employee.findOne({ email: newEmployee.email });
      if (!user) throw "Don't save employee";
    });

    it('when employee already exist with email response have status 400', async () => {
      await agent
        .post('/api/employees/')
        .send(newEmployee)
        .expect(400, {
          message: 'User is already registered',
          success: false
        });
    });

    it('when not have address: status 400', async () => {
      const employeeWithouAddress = newEmployee;
      delete employeeWithouAddress.address;
      await agent
        .post('/api/employees/')
        .send(employeeWithouAddress)
        .expect(400)
        .expect(res => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('message', expect.any(String));
        });
    });
  });

  describe('POST /api/employees/login', () => {
    it('when user is exist:  responsed tokens and user with status 200', async () => {
      const client: IEmployeeToLogin = {
        email: newEmployee.email,
        password: '123456QWE'
      };
      const res = await agent
        .post('/api/employees/login')
        .send(client)
        .expect(200);

      token = res.body.tokens.accessToken;
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('tokens', { accessToken: expect.any(String) });
      expect(res.body).toHaveProperty('user', expect.any(Object));
    });
  });

  describe('GET /api/employees/current', () => {
    it('better: Token is not valid: response should have user and tokens', async () => {
      await agent
        .get('/api/employees/current')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('user', expect.any(Object));
        });
    });
  });
});
