import { Employee } from '../../models';
import { IEmployeeFieldsToRegister, IError, IEmployeeToLogin, IEmployee } from '../../interfaces';
import { logicErr, technicalErr } from '../../errors';

class EmployeeService {
  public async register(data: IEmployeeFieldsToRegister): Promise<IError> {
    try {
      const employee = await Employee.findOne({ email: data.email });
      if (employee) return logicErr.userIsAlreadyRegistered;

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
      return technicalErr.databaseCrash;
    }
  }

  public async loginClient(data: IEmployeeToLogin): Promise<IEmployee | IError> {
    try {
      const employee = await Employee.findOne({ email: data.email })
        .select('+password')
        .exec();
      if (!employee) return logicErr.notFoundUser;
      let success = await employee.comparePassword(data.password);
      if (!success) return logicErr.notFoundUser;

      const clientObj = employee.toObject();
      return clientObj;
    } catch {
      return technicalErr.databaseCrash;
    }
  }
}
export default new EmployeeService();
