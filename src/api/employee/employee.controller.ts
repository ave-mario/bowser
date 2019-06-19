import { Request, Response } from 'express';
import EmployeeService from './employee.service';
import { Error } from '../../interfaces';

class EmployeeController {
  public postRegister(req: Request, res: Response): void {
    const origin = req.headers.origin;

    EmployeeService.register(req.body, origin).then(result =>
      !result
        ? res.status(201).json({ success: true })
        : res.status(result.status).json({ message: result.message })
    );
  }

  public login(req: Request, res: Response): void {
    EmployeeService.login(req.body).then(result =>
      !(result instanceof Error)
        ? res.status(200).json(result)
        : res.status(result.status).json({ message: result.message })
    );
  }

  public getCurrent(req: Request, res: Response): void {
    EmployeeService.getCurrent(req.user).then(result =>
      !(result instanceof Error)
        ? res.status(200).json({ user: result })
        : res.status(result.status).json({ message: result.message })
    );
  }

  public changePassword(req: Request, res: Response): void {
    EmployeeService.changeFirstPassword(req.body, req.user).then(result =>
      !(result instanceof Error)
        ? res.status(200).json({ success: true })
        : res.status(result.status).json({ message: result.message })
    );
  }
}

export const employeeController = new EmployeeController();
