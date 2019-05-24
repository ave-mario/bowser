import { Client } from '../../models';
import { IClientFieldsToRegister, IClient, IClientToLogin, IError } from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';

class ClientService {
  public async registerClient(data: IClientFieldsToRegister): Promise<IError> {
    try {
      const client = await Client.findOne({ $or: [{ phoneNumber: data.phoneNumber }, { email: data.email }] });
      if (client) return logicErr.userIsAlreadyRegistered;

      const newClient = new Client({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        loginCode: '123456'
      });
      await newClient.save();
    } catch (error) {
      return technicalErr.databaseCrash;
    }
  }

  public async loginClient(data: IClientToLogin): Promise<IClient | IError> {
    try {
      const client = await Client.findOne({ phoneNumber: data.phoneNumber });
      if (!client) return logicErr.notFoundUser;
      if (client.loginCode !== data.loginCode) {
        return logicErr.wrongCodeToLogin;
      }
      const clientObj = client.toObject();
      return clientObj;
    } catch {
      return technicalErr.databaseCrash;
    }
  }
}
export default new ClientService();
