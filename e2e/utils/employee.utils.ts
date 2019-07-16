import request from 'supertest';
import { Employee } from '../../src/models';
import {
  IEmployeeFieldsToRegister,
  SaveTokenToRedis,
  ISaveTokens
} from '../../src/interfaces';

export default async function getTokenOfEmployee(
  agent: request.SuperTest<request.Test>,
  newEmployee: IEmployeeFieldsToRegister,
  newPassword: string
): Promise<string> {
  const redis = new SaveTokenToRedis();
  const identifiedToken = await createEmployee(agent, newEmployee, redis);

  const token = await changePasswordEmployee(
    agent,
    newPassword,
    newEmployee.email,
    identifiedToken
  );

  return token;
}

async function createEmployee(
  agent: request.SuperTest<request.Test>,
  newEmployee: IEmployeeFieldsToRegister,
  redis: ISaveTokens
): Promise<string> {
  await agent.post('/api/employees').send(newEmployee);
  const user = await Employee.findOne({ email: newEmployee.email });
  let identifiedToken = await redis.findIdentifiedToken(user._id);

  return identifiedToken;
}

async function changePasswordEmployee(
  agent: request.SuperTest<request.Test>,
  newPassword: string,
  email: string,
  identifiedToken: string
): Promise<string> {
  await agent
    .put('/api/employees/password')
    .set('Authorization', 'Bearer ' + identifiedToken)
    .send({ newPassword });

  const client = {
    email,
    password: newPassword
  };
  const res = await agent.post('/api/employees/login').send(client);
  const token = res.body.tokenData.tokens.accessToken;

  return token;
}
