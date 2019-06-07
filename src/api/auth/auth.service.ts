import { ITokens } from '../../interfaces';
import { JsonTokens } from '../../config';

class AuthService {
  public async refreshToken(userId: string, role: string): Promise<ITokens> {
    try {
      const tokens: ITokens = JsonTokens.generationTokens(userId, role);
      return tokens;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
