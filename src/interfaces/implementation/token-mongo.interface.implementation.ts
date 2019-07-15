import { ISaveTokens } from '../models';
import { Token, IEmployeeModel, IdentifiedToken } from '../../models';

export class SaveTokenToMongoDB implements ISaveTokens {
  public findIdentified(userId: string): string {
    throw new Error('Method not implemented.');
  }
  public findUser(key: string, name: string): Promise<{ userId: string; role: string }> {
    throw new Error('Method not implemented.');
  }
  public findAccessToken(key: string): string {
    throw new Error('Method not implemented.');
  }

  public saveAccess(access: string, userId: string): void {
    throw new Error('Method not implemented.');
  }
  public deleteAccessRefresh(userId: string): void {
    throw new Error('Method not implemented.');
  }
  public deleteIdentified(userId: string): void {
    throw new Error('Method not implemented.');
  }
  public saveRefresh(refreshId: string, userId: string, role: string): void {
    Token.findOne({ userId }, async (err, data) => {
      if (data) {
        if (data.isValid) {
          data.tokenId = refreshId;
          await data.save();
        }
      } else {
        await new Token({ tokenId: refreshId, userId, role }).save();
      }
    });
  }

  public async saveIdentified(token: string, userId: string): Promise<void> {
    await new IdentifiedToken({ userId, token }).save();
  }
}
