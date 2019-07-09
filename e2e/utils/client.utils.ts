import { Client } from '../../src/models';
import { IClientFieldsToRegister, IClient, IClientToLogin } from 'interfaces';
import request from 'supertest';

export default async function getTokenOfClient(
  agent: request.SuperTest<request.Test>,
  newClient: IClientFieldsToRegister
): Promise<string> {
  const user = await createClient(agent, newClient);

  const token = await loginClient(agent, {
    phoneNumber: user.phoneNumber,
    loginCode: user.loginCode
  });

  return token;
}

async function createClient(
  agent: request.SuperTest<request.Test>,
  newClient: IClientFieldsToRegister
): Promise<IClient> {
  await agent.post('/api/clients').send(newClient);

  const user = await Client.findOne({ phoneNumber: newClient.phoneNumber })
    .select('+loginCode')
    .exec();

  return user;
}

async function loginClient(
  agent: request.SuperTest<request.Test>,
  client: IClientToLogin
): Promise<string> {
  const res = await agent.post('/api/clients/login').send(client);
  const token = res.body.tokenData.tokens.accessToken;

  return token;
}
