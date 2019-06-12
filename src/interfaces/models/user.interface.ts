import { IEmployee, IClient } from './index';

export interface IUserResponseLogin {
  user: IEmployee | IClient;
  tokens: {
    accessToken: string;
  };
}

export interface IUser {
  user: IEmployee | IClient;
}
