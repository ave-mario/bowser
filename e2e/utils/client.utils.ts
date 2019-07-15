import { Client } from '../../src/models';
import request from 'supertest';
import {
  IClientFieldsToRegister,
  IClient,
  IClientToLogin,
  RedisService
} from '../../src/interfaces';

export default async function getTokenOfClient(
  agent: request.SuperTest<request.Test>,
  newClient: IClientFieldsToRegister
): Promise<string> {
  const user = await createClient(agent, newClient);

  const redis = new RedisService();
  const code = await redis.getValue(user.phoneNumber);
  const token = await loginClient(agent, {
    phoneNumber: user.phoneNumber,
    loginCode: Number(code)
  });

  return token;
}

async function createClient(
  agent: request.SuperTest<request.Test>,
  newClient: IClientFieldsToRegister
): Promise<IClient> {
  await agent.post('/api/clients').send(newClient);

  return await Client.findOne({ phoneNumber: newClient.phoneNumber });
}

async function loginClient(
  agent: request.SuperTest<request.Test>,
  client: IClientToLogin
): Promise<string> {
  const res = await agent.post('/api/clients/login').send(client);
  const token = res.body.tokenData.tokens.accessToken;

  return token;
}
