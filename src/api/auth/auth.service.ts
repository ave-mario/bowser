import { ITokens } from '../../interfaces';
import { JsonTokens } from '../../utils';
import { config } from '../../config/environment';
import { IUserResponseRefreshTokens } from '../../interfaces/models/user.interface';
class AuthService {
  public async refreshToken(
    userId: string,
    role: string
  ): Promise<IUserResponseRefreshTokens> {
    try {
      const tokens: ITokens = JsonTokens.generationTokens(userId, role);
      let dateNow: Date = new Date();
      dateNow.setSeconds(dateNow.getSeconds() + config.jwt.accessExpiration);
      return { tokens, access_expires_in: dateNow.getTime() };
    } catch (err) {
      throw err;
    }
  }

  public async logout(userId: string): Promise<void> {
    await JsonTokens.deleteTokens(userId);
  }
}

export default new AuthService();
