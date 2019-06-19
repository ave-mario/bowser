import request from 'supertest';
import faker from 'faker';
import server from '../src/app';
import { Room, RoomServices } from '../src/models';
import { IRoomCreate, IRoomService, IRoom } from 'interfaces';
import getToken from './utils/employee.utils';
import createAdditions from './utils/additions.utils';
import { StatusService } from '../src/enums/status.enums';

const agent = request.agent(server);

describe('Rooms routes', () => {
  let additions: IRoomService[];
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
    await createAdditions(agent, 2, token);
    additions = await RoomServices.find();
  });

  const newRoom: IRoomCreate = {
    numberOfRoom: faker.random.number({ min: 1, max: 10000 }),
    floor: faker.random.number({ min: 1, max: 15 }),
    countRooms: faker.random.number({ min: 1, max: 5 }),
    countDoubleBeds: faker.random.number({ min: 1, max: 5 }),
    countSingleBeds: faker.random.number({ min: 1, max: 5 }),
    totalNumberBeds: faker.random.number({ min: 1, max: 10 }),
    services: [
      { _id: faker.lorem.word(), status: StatusService.Available },
      { _id: faker.lorem.word(), status: StatusService.Available }
    ],
    price: faker.random.number({ min: 0, max: 100, precision: 0.1 })
  };

  describe('POST api/rooms', () => {
    it('when all data is correct then the addition is added', async () => {
      newRoom.services[0]._id = additions[0]._id;
      newRoom.services[1]._id = additions[1]._id;
      await agent
        .post('/api/rooms')
        .set('Authorization', 'Bearer ' + token)
        .send(newRoom)
        .expect({ success: true });

      const room = await Room.findOne({ numberOfRoom: newRoom.numberOfRoom });
      expect(room.price).toBe(newRoom.price);
    });

    it('when rooms is exist then the return error', async () => {
      await agent
        .post('/api/rooms')
        .set('Authorization', 'Bearer ' + token)
        .send(newRoom)
        .expect(400);
    });
  });

  describe('GET api/rooms', () => {
    it('response should have pagination', async () => {
      await agent
        .get('/api/rooms')
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

  describe('GET api/rooms/:id', () => {
    it('when room is exist then the return this room', async () => {
      const room = await Room.findOne({ numberOfRoom: newRoom.numberOfRoom });

      await agent
        .get('/api/rooms/' + room._id)
        .expect(200)
        .expect(res => {
          const { numberOfRoom, price, floor } = res.body.room;
          expect(numberOfRoom).toBe(newRoom.numberOfRoom);
          expect(price).toBe(newRoom.price);
          expect(floor).toBe(newRoom.floor);
        });
    });
  });

  describe('PUT api/rooms', () => {
    it('when right data of change then success updated', async () => {
      const room = await Room.findOne({ numberOfRoom: newRoom.numberOfRoom });
      const updateData = {
        ...newRoom,
        price: faker.random.number({ min: 0, max: 100, precision: 0.1 })
      };

      await agent
        .put('/api/rooms/' + room._id)
        .set('Authorization', 'Bearer ' + token)
        .send(updateData)
        .expect(200);
    });
  });
});
