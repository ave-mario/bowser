import { Employee } from '../models/employees.model';
import employeeSeeds from '../seeds/employee.seeds';

export default async function(): Promise<Error | void> {
  const employeeCount = await Employee.countDocuments();

  if (employeeCount === 0)
    return Employee.remove(
      {},
      (): void => {
        for (let seed of employeeSeeds) {
          let newEmployee = new Employee(seed);
          newEmployee.save();
        }
        console.log('Employee seeded');
      }
    ).catch(err => console.log(err));
}
