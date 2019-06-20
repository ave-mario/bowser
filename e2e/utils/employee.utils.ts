import { Employee, IdentifiedToken } from '../../src/models';
import { IEmployeeFieldsToRegister } from 'interfaces';
import request from 'supertest';

export default async function getTokenOfEmployee(
  agent: request.SuperTest<request.Test>,
  newEmployee: IEmployeeFieldsToRegister,
  newPassword: string
): Promise<string> {
  const identifiedToken = await createEmployee(agent, newEmployee);

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
  newEmployee: IEmployeeFieldsToRegister
): Promise<string> {
  await agent.post('/api/employees').send(newEmployee);
  const user = await Employee.findOne({ email: newEmployee.email })
    .select('+identifiedToken')
    .exec();
  let identifiedToken = await IdentifiedToken.findOne({
    userId: user._id
  }).then(({ token }) => token);

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
