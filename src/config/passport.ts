import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Roles } from '../enums';
import { config } from './environment';
import { Client, Employee } from '../models';
import { IClient, IEmployee } from '../interfaces';

export class Passport {
  public static jwtStrategy(): void {
    let option = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret
    };

    passport.use(
      new Strategy(
        option,
        (
          token: any,
          done: (error: null, data: IEmployee | IClient | boolean) => void
        ) => {
          let userId: string = token.id;
          return Passport.getUser(token.role, userId).then(data => {
            if (data) {
              return done(null, data);
            } else {
              return done(null, false);
            }
          });
        }
      )
    );
  }

  private static async getUser(
    role: string,
    userId: string
  ): Promise<IClient | IEmployee | null> {
    let user: IClient | IEmployee | null;
    if (role === Roles.Client) {
      user = await Client.findById(userId);
    } else {
      user = await Employee.findById(userId);
    }
    return user;
  }
}

export const initialize = () => passport.initialize();
export const authenticateJwt = () => passport.authenticate('jwt', { session: false });
