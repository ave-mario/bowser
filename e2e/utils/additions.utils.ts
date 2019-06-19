import request from 'supertest';
import faker from 'faker';

export default async function createAdditions(
  agent: request.SuperTest<request.Test>,
  count: number,
  token: string
): Promise<boolean> {
  for (let i = 0; i < count; i++) {
    const newAddition = {
      name: faker.lorem.word(),
      price: faker.random.number({ min: 0, max: 10 })
    };

    await agent
      .post('/api/rooms-services')
      .set('Authorization', 'Bearer ' + token)
      .send(newAddition);
  }

  return true;
}
