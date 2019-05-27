import {
  IEmployeeFieldsToRegister,
  Error,
  IClientFieldsToRegister,
  IClientToLogin,
  IEmployeeToLogin,
  IUserResponseLogin,
  IUser,
  IClient
} from '../../interfaces';
import { IEmployeeModel } from '../../models';

export interface IUserService {
  register(data: IEmployeeFieldsToRegister | IClientFieldsToRegister): Promise<Error>;
  login(data: IClientToLogin | IEmployeeToLogin): Promise<Error | IUserResponseLogin>;
  getCurrent(data: IClient | IEmployeeModel): Promise<Error | IUser>;
}
