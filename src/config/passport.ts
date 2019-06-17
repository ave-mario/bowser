import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Roles } from '../enums';
import { config } from './environment';
import { Client, Employee, Token, IdentifiedToken } from '../models';
import { IClient, IEmployee } from '../interfaces';

export class Passport {
  public static jwtStrategy(): void {
    let option = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret
    };

    passport.use(
      'refresh-jwt',
      new Strategy(
        option,
        async (
          token: any,
          done: (error: any, user?: IEmployee | IClient, info?: string) => void
        ) => {
          let userId;
          const tokenRefresh = await Token.findOne({ tokenId: token.id });
          if (!tokenRefresh) {
            return done(null);
          }
          userId = tokenRefresh.userId;
          return Passport.getUser(tokenRefresh.role, userId).then(user => {
            if (user) {
              return done(null, user, token.role);
            } else {
            }
          });
        }
      )
    );

    passport.use(
      'identified-jwt',
      new Strategy(
        option,
        async (token: any, done: (error: any, user?: IEmployee | boolean) => void) => {
          const identified = await IdentifiedToken.findOne({ userId: token.id });
          let user = null;
          if (identified) {
            user = await Employee.findById(identified.userId);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null);
          }
        }
      )
    );

    passport.use(
      new Strategy(
        option,
        (
          token: any,
          done: (error: any, user?: IEmployee | IClient, info?: string) => void
        ) => {
          let userId: string = token.id;
          return Passport.getUser(token.role, userId).then(user => {
            if (user) {
              return done(null, user, token.role);
            } else {
              return done(null);
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
export const authenticateRefreshJwt = () =>
  passport.authenticate('refresh-jwt', { session: false });
export const authenticateIdentifiedToken = () =>
  passport.authenticate('identified-jwt', { session: false });
