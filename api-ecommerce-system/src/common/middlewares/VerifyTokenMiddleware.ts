import { NextFunction, Request, Response } from "express";
import { JwtPayload, decode } from "jsonwebtoken";
import { AppError } from "../../app.error";

export class VerifyTokenMiddleware {
  static execute(req: Request, res: Response, next: NextFunction) {
    const authToken: string | undefined = req.headers.authorization;

    const token: string | undefined = authToken?.split(" ")[1];
    if (!token) throw new AppError("Token inválido.", 401);

    const decoded: string | JwtPayload | null = decode(token);
    if (!decoded) throw new AppError("Token inválido.", 401);

    req.id_user = String(decoded.sub);

    next();
  }
}
