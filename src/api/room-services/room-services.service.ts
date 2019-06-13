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
}

export default new RoomsServices();
