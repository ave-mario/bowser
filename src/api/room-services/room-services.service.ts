import { Error, IRoomService } from '../../interfaces';
import { RoomServices } from '../../models';
import { technicalErr, logicErr } from '../../errors';
import { PaginateResult } from 'mongoose';

class RoomsServices {
  public async create(data: IRoomService): Promise<IRoomService | Error> {
    try {
      return await new RoomServices({
        ...data
      })
        .save()
        .then(service => service);
    } catch {
      throw new Error(logicErr.dataAlreadyExist);
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
