import faker from 'faker';
import { Client } from '../../models';
import {
  IClientFieldsToRegister,
  IUserResponseLogin,
  IClientToLogin,
  Error,
  IClient,
  IUserService,
  IUser,
  ITokens,
  EmailService
} from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';
import { JsonTokens } from '../../config';
import { Roles, StatusUsers, CountAttempt } from '../../enums';
import { Transport } from '../../utils';

class ClientService implements IUserService {
  private _transporter: Transport = new Transport(new EmailService());

  public async register(data: IClientFieldsToRegister): Promise<Error | void> {
    try {
      const client = await Client.findOne({
        $or: [{ phoneNumber: data.phoneNumber }, { email: data.email }]
      });
      if (client) return new Error(logicErr.userIsAlreadyRegistered);
      const loginCode = faker.random.number({ min: 100000, max: 1000000 });
      const newClient = new Client({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        loginCode
      });
      this._transporter.sendCode(newClient.email, loginCode);
      await newClient.save();
    } catch (error) {
      if (error.code === logicErr.wrongCodeToLogin.code) return error;
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async login(data: IClientToLogin): Promise<Error | IUserResponseLogin> {
    try {
      const client = await Client.findOne({
        phoneNumber: data.phoneNumber
      })
        .select('+loginCode')
        .exec();
      if (!client) return new Error(logicErr.notFoundUser);
      if (client.status === StatusUsers.Bloking) return new Error(logicErr.userBlocked);
      try {
        await this.checkLoginCode(client, data.loginCode);
      } catch (err) {
        return err;
      }

      const clientObj = client.toObject();
      const tokens: ITokens = JsonTokens.generationTokens(clientObj._id, Roles.Client);

      return {
        user: clientObj,
        tokens
      };
    } catch (err) {
      throw err;
    }
  }

  private async checkLoginCode(client: IClient, loginCode: number): Promise<void> {
    let error;
    if (client.loginCode != loginCode) {
      if (client.attemptLogin < CountAttempt.loginClient) {
        client.attemptLogin = client.attemptLogin + 1;
        error = logicErr.wrongCodeToLogin;
      } else {
        client.attemptLogin = 0;
        client.status = StatusUsers.Bloking;
        client.loginCode = undefined;
        error = logicErr.userBlocked;
      }
    } else {
      client.attemptLogin = 0;
      client.loginCode = undefined;
    }
    await client.save();
    if (error) throw new Error(error);
  }

  public async generateLoginCode(identify: string): Promise<Error | boolean> {
    try {
      const client = await Client.findOne({
        $or: [{ phoneNumber: identify }, { email: identify }]
      })
        .select('+loginCode')
        .exec();
      if (!client) return new Error(logicErr.notFoundUser);
      if (client.status === StatusUsers.Bloking) return new Error(logicErr.userBlocked);
      const code = faker.random.number({ min: 100000, max: 1000000 });
      this._transporter.sendCode(client.email, code);
      client.loginCode = code;
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
