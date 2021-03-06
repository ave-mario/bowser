import faker from 'faker';
import { Employee, IEmployeeModel, IdentifiedToken } from '../../models';
import {
  IEmployeeFieldsToRegister,
  Error,
  IUserResponseLogin,
  IEmployeeToLogin,
  IUserService,
  IUser,
  ITokens,
  EmailService
} from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';
import { JsonTokens } from '../../config';
import { Roles, StatusUsers } from '../../enums';
import { Transport } from '../../utils';
import { config } from '../../config/environment';
import { date } from 'joi';
class EmployeeService implements IUserService {
  private _transporter: Transport = new Transport(new EmailService());

  public async register(
    data: IEmployeeFieldsToRegister,
    originLink: string | string[]
  ): Promise<Error | void> {
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
      const token: string = JsonTokens.generateIdentifiedToken(
        newEmployee,
        Roles.Employee
      );

      this._transporter.sendLinkToChangePassword(
        originLink,
        newEmployee.email,
        token,
        newEmployee.name
      );
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
      if (!employee) return new Error(logicErr.incorrectDataToLogin);

      if (employee.status === StatusUsers.Blocking)
        return new Error(logicErr.userBlocked);

      let success = await employee.comparePassword(data.password);
      if (!success) return new Error(logicErr.incorrectDataToLogin);

      const clientObj = employee.toObject();
      const tokens: ITokens = JsonTokens.generationTokens(clientObj._id, Roles.Employee);
      let dateNow: Date = new Date();
      dateNow.setSeconds(dateNow.getSeconds() + config.jwt.accessExpiration);
      return {
        user: clientObj,
        tokenData: {
          tokens,
          access_expires_in: dateNow.getTime()
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

  public async changeFirstPassword(
    data: { newPassword: string },
    employee: IEmployeeModel
  ): Promise<Error | boolean> {
    try {
      if (!employee) return new Error(logicErr.notFoundUser);

      employee.status = StatusUsers.Active;
      employee.password = data.newPassword;
      employee.identifiedToken = undefined;
      await employee.save();

      await IdentifiedToken.remove({ userId: employee._id });

      return true;
    } catch {
      return new Error(technicalErr.databaseCrash);
    }
  }
}
export default new EmployeeService();
