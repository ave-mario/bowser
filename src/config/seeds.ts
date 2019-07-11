import { Employee } from '../models';
import employeeSeeds from '../seeds/employee.seeds';
import { config, logger } from '../config';

export default async function(): Promise<Error | void> {
  const employeeCount = await Employee.countDocuments();
  if (config.app.environment !== 'test') {
    if (employeeCount === 0)
      return Employee.remove(
        {},
        async (): Promise<void> => {
          await Employee.create(employeeSeeds);
          logger.info('Employee seeded');
        }
      ).catch((err): any => logger.warn(err));
  }
}
