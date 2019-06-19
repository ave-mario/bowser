import { Error, IRoomCreate, IRoom } from '../../interfaces';
import { Room } from '../../models';
import { StatusService } from '../../enums';
import { technicalErr, logicErr } from '../../errors';
import { PaginateResult } from 'mongoose';

class RoomService {
  public async create(data: IRoomCreate): Promise<Error | void> {
    const room = new Room({
      ...data,
      status: StatusService.Available
    });

    try {
      await room.save();
    } catch {
      return new Error(logicErr.dataAlreadyExist);
    }
  }

  public async get(queries: {
    page?: string;
    perPage?: string;
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

  public async update(_id: string, data: IRoomCreate): Promise<boolean> {
    try {
      await Room.updateOne(
        { _id },
        {
          ...data
        }
      );
      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default new RoomService();
