import { Request, Response } from 'express';

export interface Controller {
  get(req: Request, res: Response): void;
  getById(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  remove(req: Request, res: Response): void;
}
