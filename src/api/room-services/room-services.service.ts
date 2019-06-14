import { Error, IRoomService } from '../../interfaces';
import { RoomServices } from '../../models';
import { technicalErr } from '../../errors';
import { PaginateResult } from 'mongoose';

class RoomsServices {
  public async create(data: IRoomService[]): Promise<void> {
    try {
      await RoomServices.collection.insertMany(data);
    } catch (err) {
      throw new Error(technicalErr.databaseCrash);
    }
  }

  public async get(queries: {
    page: string;
    perPage: string;
  }): Promise<PaginateResult<IRoomService>> {
    const options = {
      page: parseInt(queries.page, 10) || 1,
      limit: parseInt(queries.perPage, 10) || 10
    };
    const services = await RoomServices.paginate({}, options);
    return services;
  }

  public async getById(id: string): Promise<IRoomService> {
    const service = await RoomServices.findById(id);
    const data = service.toObject();
    return data;
  }

  public async update(_id: string, data: IRoomService): Promise<boolean> {
    try {
      await RoomServices.updateOne(
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

export default new RoomsServices();
