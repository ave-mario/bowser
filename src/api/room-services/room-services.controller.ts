import service from './room-services.service';
import { Request, Response } from 'express';
import { Controller } from '../../interfaces/controller.interface';

class RoomController implements Controller {
  public create(req: Request, res: Response): void {
    service
      .create(req.body.services)
      .then(() => res.status(200).json({ success: true }))
      .catch(err => {
        res.status(500).json({ success: false, message: err.message });
      });
  }

  public get(req: Request, res: Response): void {
    service
      .get(req.query)
      .then(data => res.status(200).json({ success: true, ...data }))
      .catch(err => {
        res.status(400).json({ success: false, message: err.message });
      });
  }

  public getById(req: Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
  public update(req: Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
  public remove(req: Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
}

export default new RoomController();
