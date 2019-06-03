import faker from 'faker';
import { Client } from '../../models';
import {
  IClientFieldsToRegister,
  IUserResponseLogin,
  IClientToLogin,
  Error,
  IClient,
  IUserService,
  IUser
} from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';
import { JsonTokens, Roles } from '../../config';

class ClientService implements IUserService {
  public async register(data: IClientFieldsToRegister): Promise<Error> {
    try {
      const client = await Client.findOne({
        $or: [{ phoneNumber: data.phoneNumber }, { email: data.email }]
      });
      if (client) return new Error(logicErr.userIsAlreadyRegistered);
      const newClient = new Client({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        loginCode: faker.random.number({ min: 100000, max: 1000000 })
      });
      await newClient.save();
    } catch (error) {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async login(data: IClientToLogin): Promise<Error | IUserResponseLogin> {
    try {
      const client = await Client.findOne({ phoneNumber: data.phoneNumber });
      if (!client) return new Error(logicErr.notFoundUser);
      if (client.loginCode !== data.loginCode) {
        return new Error(logicErr.wrongCodeToLogin);
      }
      const clientObj = client.toObject();
      const accessToken: string = JsonTokens.generateAccessToken(
        clientObj._id,
        Roles.Client
      );
      return {
        user: clientObj,
        tokens: {
          accessToken
        }
      };
    } catch {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async generateLoginCode(phoneNumber: string): Promise<Error | boolean> {
    try {
      const client = await Client.findOne({ phoneNumber });
      if (!client) return new Error(logicErr.notFoundUser);
      //add to send sms for client
      client.loginCode = faker.random.number({ min: 100000, max: 1000000 });
      await client.save();
    } catch (error) {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async getCurrent(data: IClient): Promise<Error | IUser> {
    try {
      if (!data) return new Error(logicErr.notFoundUser);
      const dataObj = data.toObject();
      return dataObj;
    } catch (error) {
      return new Error(technicalErr.databaseCrash);
    }
  }
}
export default new ClientService();
