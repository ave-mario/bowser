import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { RoomServices } from '../src/models';
import { IRoomService } from 'interfaces';
import getToken from './utils/employee.utils';

const agent = request.agent(server);

describe('Services of room routes', () => {
  const newAddition = {
    name: faker.lorem.word(),
    price: faker.finance.amount()
  };
  let token = '';

  const newPassword = faker.internet.password();
  const newEmployee = {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    patronymic: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber('+375#########'),
    address: `${faker.address.country()}, ${faker.address.city()}, ${faker.address.streetAddress()}`
  };
  beforeAll(async () => {
    token = await getToken(agent, newEmployee, newPassword);
  });

  describe('POST api/rooms-services', () => {
    it('when have not token then the return error', async () => {
      await agent
        .post('/api/rooms-services')
        .send(newAddition)
        .expect(401);
    });

    it('when all data is correct then the addition is added', async () => {
      await agent
        .post('/api/rooms-services')
        .set('Authorization', 'Bearer ' + token)
        .send(newAddition)
        .expect({ success: true })
        .expect(201);

      const service = await RoomServices.findOne({ name: newAddition.name });
      expect(service.name).toBe(newAddition.name);
    });
  });

  describe('GET api/rooms-services', () => {
    it('when role is employee then get all services of room', async () => {
      await agent
        .get('/api/rooms-services')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('docs', expect.any(Array));
          expect(res.body).toHaveProperty('total', expect.any(Number));
          expect(res.body).toHaveProperty('limit', expect.any(Number));
          expect(res.body).toHaveProperty('page', expect.any(Number));
          expect(res.body).toHaveProperty('pages', expect.any(Number));
        });
    });
  });

  describe('PUT api/rooms-services', () => {
    let service: IRoomService;

    beforeAll(async () => {
      service = await RoomServices.findOne({ name: newAddition.name });
    });

    it("when wrong price then don't change addition", async () => {
      const updateData = {
        name: newAddition.name,
        price: faker.lorem.word()
      };
      await agent
        .put('/api/rooms-services/' + service._id)
        .set('Authorization', 'Bearer ' + token)
        .send(updateData)
        .expect(400)
        .expect(res => {
          expect(res.body.success).toBe(false);
        });
    });

    it('when right data of change then success updated', async () => {
      const updateData = {
        name: newAddition.name,
        price: faker.finance.amount()
      };
      await agent
        .put('/api/rooms-services/' + service._id)
        .set('Authorization', 'Bearer ' + token)
        .send(updateData)
        .expect(200);
    });
  });
});
