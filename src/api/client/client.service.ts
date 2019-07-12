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
  EmailService,
  RedisService
} from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';
import { JsonTokens } from '../../config';
import { Roles, StatusUsers, CountAttempt } from '../../enums';
import { Transport, Cash } from '../../utils';

class ClientService implements IUserService {
  private _transporter: Transport = new Transport(new EmailService());
  private _serviceCash: Cash = new Cash(new RedisService());

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
      await newClient.save().then(async doc => {
        await this._serviceCash.saveCode(doc.phoneNumber, loginCode);
        await this._transporter.sendCode(newClient.email, loginCode);
      });
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
      if (client.status === StatusUsers.Blocking) return new Error(logicErr.userBlocked);
      try {
        const code = await this._serviceCash.getCode(data.phoneNumber);
        await this.checkLoginCode(client, data.loginCode, Number(code));
      } catch (err) {
        return err;
      }

      const clientObj = client.toObject();
      const tokens: ITokens = JsonTokens.generationTokens(clientObj._id, Roles.Client);
      let dateNow: Date = new Date();
      return {
        user: clientObj,
        tokenData: {
          tokens,
          access_expires_in: dateNow.getTime()
        }
      };
    } catch (err) {
      throw err;
    }
  }

  private async checkLoginCode(
    client: IClient,
    loginCode: number,
    code: number
  ): Promise<void> {
    let error;
    if (code != loginCode) {
      if (client.attemptLogin < CountAttempt.loginClient) {
        client.attemptLogin = client.attemptLogin + 1;
        error = logicErr.wrongCodeToLogin;
      } else {
        client.attemptLogin = 0;
        client.status = StatusUsers.Blocking;
        await this._serviceCash.deleteCode(client.phoneNumber);
        client.loginCode = undefined;
        error = logicErr.userBlocked;
      }
    } else {
      client.attemptLogin = 0;
      await this._serviceCash.deleteCode(client.phoneNumber);
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
      if (client.status === StatusUsers.Blocking) return new Error(logicErr.userBlocked);
      const code = faker.random.number({ min: 100000, max: 1000000 });
      client.loginCode = code;
      await client.save(async () => {
        await this._serviceCash.saveCode(client.phoneNumber, code);
        await this._transporter.sendCode(client.email, code);
      });
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
