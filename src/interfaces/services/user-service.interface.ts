import {
  IEmployeeFieldsToRegister,
  Error,
  IClientFieldsToRegister,
  IClientToLogin,
  IEmployeeToLogin,
  IUserResponseLogin,
  IUser,
  IClient
} from '../models';
import { IEmployeeModel } from '../../models';

export interface IUserService {
  register(
    data: IEmployeeFieldsToRegister | IClientFieldsToRegister,
    originLink?: string
  ): Promise<Error | void>;
  login(data: IClientToLogin | IEmployeeToLogin): Promise<Error | IUserResponseLogin>;
  getCurrent(data: IClient | IEmployeeModel): Promise<Error | IUser>;
}
