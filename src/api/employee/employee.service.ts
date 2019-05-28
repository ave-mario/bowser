import { Employee, IEmployeeModel } from '../../models';
import {
  IEmployeeFieldsToRegister,
  Error,
  IUserResponseLogin,
  IEmployeeToLogin,
  IUserService,
  IUser
} from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';
import { JsonTokens, Roles } from '../../config';

class EmployeeService implements IUserService {
  public async register(data: IEmployeeFieldsToRegister): Promise<Error> {
    try {
      const employee = await Employee.findOne({ email: data.email });
      if (employee) return new Error(logicErr.userIsAlreadyRegistered);

      const newEmployee = new Employee({
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
        password: '12345QWE'
      });

      await newEmployee.save();
    } catch (error) {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async login(data: IEmployeeToLogin): Promise<IUserResponseLogin | Error> {
    try {
      const employee = await Employee.findOne({ email: data.email })
        .select('+password')
        .exec();
      if (!employee) return new Error(logicErr.notFoundUser);
      let success = await employee.comparePassword(data.password);
      if (!success) return new Error(logicErr.notFoundUser);

      const clientObj = employee.toObject();
      const accessToken: string = JsonTokens.generateAccessToken(
        clientObj._id,
        Roles.Employee
      );
      return {
        user: clientObj,
        tokens: {
          accessToken
        }
      };
    } catch {
      return new Error(technicalErr.databaseCrash);
    }
  }

  public async getCurrent(data: IEmployeeModel): Promise<Error | IUser> {
    try {
      if (!data) return new Error(logicErr.notFoundUser);
      const dataObj = data.toObject();
      return dataObj;
    } catch (error) {
      return new Error(technicalErr.databaseCrash);
    }
  }
}
export default new EmployeeService();
