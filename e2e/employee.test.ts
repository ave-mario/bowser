import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { IEmployeeToLogin, IEmployeeFieldsToRegister } from '../src/interfaces';
import { Employee, IdentifiedToken } from '../src/models';
import { StatusUsers } from '../src/enums';
import { logicErr } from '../src/errors';

const agent = request.agent(server);

describe('Employee routes', () => {
  beforeAll(async () => {
    await Employee.deleteMany({});
  });
  let token = '';
  let identifiedToken: string;
  const newPassword = faker.internet.password();
  const newEmployee: IEmployeeFieldsToRegister = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    patronymic: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('+375#########'),
    address: `${faker.address.country()}, ${faker.address.city()}, ${faker.address.streetAddress()}`
  };
  describe('POST /api/employees is add new', () => {
    it('when all data is correct then the employee is added', async () => {
      await agent
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const user = await Employee.findOne({ email: newEmployee.email })
        .select('+identifiedToken')
        .exec();
      expect(user.status).toBe(StatusUsers.NeedChangePassword);

      identifiedToken = await IdentifiedToken.findOne({ userId: user._id }).then(
        ({ token }) => token
      );
    });

    it('when email or phone is already registered then error add', async () => {
      await agent
        .post('/api/employees/')
        .send(newEmployee)
        .expect(400, {
          message: logicErr.userIsAlreadyRegistered.msg
        });
    });

    it('when data not have address then error in validation', async () => {
      const employeeWithoutAddress = newEmployee;
      delete employeeWithoutAddress.address;
      await agent
        .post('/api/employees/')
        .send(employeeWithoutAddress)
        .expect(400)
        .expect(res => {
          expect(res.body).toHaveProperty('success', false);
          expect(res.body).toHaveProperty('message', expect.any(String));
        });
    });
  });

  describe('PUT /api/employees/password first change', () => {
    it('when token is valid and new password not valid then return error', () => {
      agent
        .put('/api/employees/password')
        .set('Authorization', 'Bearer ' + identifiedToken)
        .send({ newPassword: '123' })
        .expect(400);
    });

    it('when token and new password is valid then success change password and status user', async () => {
      await agent
        .put('/api/employees/password')
        .set('Authorization', 'Bearer ' + identifiedToken)
        .send({ newPassword })
        .expect(200, { success: true });

      const user = await Employee.findOne({ email: newEmployee.email });
      expect(user.status).toBe(StatusUsers.Active);
    });
  });

  describe('POST /api/employees/login', () => {
    it('when employee with email is correct then the response have tokens and own user', async () => {
      const client: IEmployeeToLogin = {
        email: newEmployee.email,
        password: newPassword
      };
      const res = await agent
        .post('/api/employees/login')
        .send(client)
        .expect(200);

      expect(res.body).toHaveProperty('tokenData', {
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        },
        access_expires_in: expect.any(Number)
      });
      expect(res.body).toHaveProperty('user', expect.any(Object));
      token = res.body.tokenData.tokens.accessToken;
    });
  });

  describe('GET /api/employees/current', () => {
    it('when token is valid then response return current user', async () => {
      await agent
        .get('/api/employees/current')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('user', expect.any(Object));
        });
    });
  });
});
