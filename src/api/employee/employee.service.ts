import faker from 'faker';
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
import { JsonTokens } from '../../config';
import { Roles, StatusUsers } from '../../enums';
import { EmailService } from '../../utils';

class EmployeeService implements IUserService {
  public async register(data: IEmployeeFieldsToRegister): Promise<Error> {
    try {
      const employee = await Employee.findOne({
        $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }]
      });
      if (employee) return new Error(logicErr.userIsAlreadyRegistered);

      const newEmployee = new Employee({
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
        password: faker.internet.password()
      });
      const token: string = JsonTokens.generateIdentifiedToken(newEmployee._id);
      newEmployee.identifiedToken = token;

      EmailService.sendLinkToChangePassword(newEmployee.email, token);
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

      if (employee.status === StatusUsers.Bloking) return new Error(logicErr.userBloking);

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

  public async changeFirsrtPassword(
    data: { newPassword: string; token: string },
    employeeId: IEmployeeModel
  ): Promise<Error | boolean> {
    try {
      const employee = await Employee.findOne({
        _id: employeeId,
        identifiedToken: data.token
      });
      if (!employee) return new Error(logicErr.notFoundUser);

      employee.status = StatusUsers.Active;
      employee.password = data.newPassword;
      employee.identifiedToken = undefined;
      await employee.save();

      return true;
    } catch {
      return new Error(technicalErr.databaseCrash);
    }
  }
}
export default new EmployeeService();
