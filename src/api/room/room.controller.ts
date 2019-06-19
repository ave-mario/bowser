import service from './room.service';
import { Request, Response } from 'express';
import { Controller } from '../../interfaces/controller.interface';
import { technicalErr } from '../../errors';

class RoomController implements Controller {
  public create(req: Request, res: Response): void {
    service
      .create(req.body)
      .then(result =>
        !result
          ? res.status(201).json({ success: true })
          : res.status(400).json({ message: result.message, success: false })
      )
      .catch(() => {
        res.status(500).json({ success: false, message: technicalErr.databaseCrash.msg });
      });
  }

  public get(req: Request, res: Response): void {
    service
      .get(req.query)
      .then(data => res.status(200).json({ success: true, ...data }))
      .catch(err => {
        res.status(500).json({ success: false, message: err.message });
      });
  }

  public getById(req: Request, res: Response): void {
    service
      .getById(req.params.id)
      .then(room => res.status(200).json({ success: true, room }));
  }

  public update(req: Request, res: Response): void {
    service
      .update(req.params.id, req.body)
      .then(() => res.status(200).json({ success: true }))
      .catch(err => {
        res.status(500).json({ success: false, message: err.message });
      });
  }
}

export default new RoomController();
