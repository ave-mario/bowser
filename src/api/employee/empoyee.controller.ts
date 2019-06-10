import { Request, Response } from 'express';
import EmployeeService from './employee.service';
import { Error } from '../../interfaces';
import { StatusUsers } from 'src/enums';

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

  public changePassword(req: Request, res: Response): void {
    if (req.user.status === StatusUsers.NeedChangePassword) {
      EmployeeService.changeFirsrtPassword(req.body, req.user._id).then(result =>
        !(result instanceof Error)
          ? res.status(200).json({ success: true })
          : res.status(result.status).json({ message: result.message, success: false })
      );
    } else {
      res
        .status(400)
        .json({ message: 'Not router for change old password', success: false });
    }
  }
}

export const empoyeeController = new ClientController();
