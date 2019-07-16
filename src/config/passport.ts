import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Roles, TokensNames } from '../enums';
import { config } from './environment';
import { Client, Employee } from '../models';
import { IClient, IEmployee, ISaveTokens, SaveTokenToRedis } from '../interfaces';

export class Passport {
  private static Token: ISaveTokens = new SaveTokenToRedis();

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
          const tokenRefresh = await this.Token.findRefreshToken(token.sub, token.id);
          if (!tokenRefresh) {
            return done(null);
          }
          this.Token.deleteAccessRefresh(token.id);
          return Passport.getUser(token.role, token.sub).then(user => {
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
          const identified = await this.Token.findIdentifiedToken(token.sub);
          let user = null;
          if (identified) {
            user = await Employee.findById(token.sub);
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
        async (
          token: any,
          done: (error: any, user?: IEmployee | IClient, info?: string) => void
        ) => {
          const isValid = await this.Token.findRefreshToken(token.sub, token.id);
          if (!isValid) {
            return done(null);
          }
          return Passport.getUser(token.role, token.sub).then(user => {
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
