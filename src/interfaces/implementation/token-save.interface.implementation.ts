import { SaveRefreshTokens } from '../token.interface';
import { Token } from '../../models';

export class SaveTokenToMongoDB implements SaveRefreshTokens {
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
}
