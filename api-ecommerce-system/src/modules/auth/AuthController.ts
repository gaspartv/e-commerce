import { Request, Response } from "express";
import { AuthService } from "./AuthService";

export class AuthController {
  protected authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signin = async (req: Request, res: Response) => {
    const response = await this.authService.signin(req.body);
    return res.status(201).json(response);
  };
}
