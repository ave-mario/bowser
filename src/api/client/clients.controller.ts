import { Request, Response } from 'express';
import ClientService from './clients.service';

class ClientController {
  public postRegister(req: Request, res: Response): void {
    let status: number;
    ClientService.registerClient(req.body).then(result =>
      !result
        ? res.status(201).json({ status: 'success' })
        : (result.code >= 2000 ? (status = 500) : (status = 400)) &&
          res.status(status).json({ message: result.msg, status: 'error' })
    );
  }

  public login(req: Request, res: Response): void {
    ClientService.loginClient(req.body).then(result =>
      !result.hasOwnProperty('code')
        ? res.status(200).json(result)
        : res.status(400).json({ message: result, status: 'error' })
    );
  }
}

export const clientController = new ClientController();
