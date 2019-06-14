import service from './auth.service';
import { Request, Response } from 'express';

class AuthController {
  public refreshToken(req: Request, res: Response): void {
    service
      .refreshToken(req.user._id, req.authInfo)
      .then(tokens => {
        res.status(200).json({ tokens, success: true });
      })
      .catch(err => {
        res.status(500).json({ success: false, message: err.message });
      });
  }

  public checkToken(req: Request, res: Response): void {
    if (req.user) {
      res.status(200).json({ success: true });
    }
  }
}

export default new AuthController();