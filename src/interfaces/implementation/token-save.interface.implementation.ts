import { ISaveRefreshTokens } from '../models';
import { Token, IEmployeeModel, IdentifiedToken } from '../../models';

export class SaveTokenToMongoDB implements ISaveRefreshTokens {
  public save(refreshId: string, userId: string, role: string): void {
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

  public async saveIdentified(token: string, user: IEmployeeModel): Promise<void> {
    await new IdentifiedToken({ userId: user._id, token }).save();
  }
}
