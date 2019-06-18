import { IEmployee, IClient } from './index';

export interface IUserResponseLogin {
  user: IEmployee | IClient;
  tokens: {
    accessToken: string;
  };
  access_expires_in: number;
}

export interface IUser {
  user: IEmployee | IClient;
}
