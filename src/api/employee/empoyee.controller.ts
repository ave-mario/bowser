import { Request, Response } from 'express';
import EmployeeService from './employee.service';
import { Error } from '../../interfaces';

class ClientController {
  public postRegister(req: Request, res: Response): void {
    EmployeeService.register(req.body).then(result =>
      !result
        ? res.status(201).json({ success: true })
        : res.status(result.status).json({ message: result.message, success: false })
    );
  }

  public login(req: Request, res: Response): void {
    EmployeeService.login(req.body).then(result =>
      !(result instanceof Error)
        ? res.status(200).json({ ...result, success: true })
        : res.status(result.status).json({ message: result.message, success: false })
    );
  }

  public getCurrent(req: Request, res: Response): void {
    EmployeeService.getCurrent(req.user).then(result =>
      !(result instanceof Error)
        ? res.status(200).json({ user: result, success: true })
        : res.status(result.status).json({ message: result.message, success: false })
    );
  }
}

export const empoyeeController = new ClientController();
