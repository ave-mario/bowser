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
    it('when all data is correct then the employee is added', async () => {
      await agent
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const user = await Employee.findOne({ email: newEmployee.email });
      if (!user) throw "Don't save employee";
    });

    it('when email or phone is already registered then error add', async () => {
      await agent
        .post('/api/employees/')
        .send(newEmployee)
        .expect(400, {
          message: 'User is already registered',
          success: false
        });
    });

    it('when data not have address then error in validation', async () => {
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
    it('when employee with email is correct then the response have tokens and own user', async () => {
      const client: IEmployeeToLogin = {
        email: newEmployee.email,
        password: '12345QWE'
      };
      const res = await agent
        .post('/api/employees/login')
        .send(client)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('tokens', { accessToken: expect.any(String) });
      expect(res.body).toHaveProperty('user', expect.any(Object));
      token = res.body.tokens.accessToken;
    });
  });

  describe('GET /api/employees/current', () => {
    it('when token is valid then response return current user', async () => {
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
