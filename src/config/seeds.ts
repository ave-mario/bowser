import { Employee } from '../models/employees.model';
import employeeSeeds from '../seeds/employee.seeds';
import { config } from '../config/environment';

export default async function(): Promise<Error | void> {
  const employeeCount = await Employee.countDocuments();
  if (config.app.environment !== 'test') {
    if (employeeCount === 0)
      return Employee.remove(
        {},
        async (): Promise<void> => {
          for (let seed of employeeSeeds) {
            let newEmployee = new Employee(seed);
            await newEmployee.save();
          }
          console.log('Employee seeded');
        }
      ).catch(err => console.log(err));
  }
}
