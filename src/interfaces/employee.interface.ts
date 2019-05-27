import { IClient } from './client.interface';
export interface IEmployee {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  status: number;
}

export interface IEmployeeFieldsToRegister {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface IEmployeeToLogin {
  email: string;
  password: string;
}

export interface IUserResponseLogin {
  user: IEmployee | IClient;
  tokens: {
    accessToken: string;
  };
}

export interface IUser {
  user: IEmployee | IClient;
}
