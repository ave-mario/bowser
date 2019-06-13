import { Error, IRoomCreate, IRoom } from '../../interfaces';
import { Room } from '../../models';
import { StatusService } from '../../enums';
import { technicalErr } from '../../errors';
import { PaginateResult } from 'mongoose';

class RoomService {
  public async create(data: IRoomCreate): Promise<Error> {
    try {
      new Room({
        ...data,
        status: StatusService.Available
      }).save();
    } catch (err) {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async get(queries: {
    page: string;
    perPage: string;
  }): Promise<PaginateResult<IRoom>> {
    const options = {
      page: parseInt(queries.page, 10) || 1,
      limit: parseInt(queries.perPage, 10) || 10
    };
    const rooms = await Room.paginate({}, options);
    return rooms;
  }

  public async getById(id: string): Promise<IRoom> {
    const room = await Room.findById(id);
    const data = room.toObject();
    return data;
  }
}

export default new RoomService();
