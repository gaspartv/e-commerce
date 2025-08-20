import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { AppError } from "../../app.error";

export class ValidationSchemaMiddleware {
  static execute(schema: AnySchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedBody = await schema.validate(req.body, {
          stripUnknown: true,
          abortEarly: false,
        });

        req.body = validatedBody;
        return next();
      } catch (error: any) {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.errors,
        }));

        throw new AppError("Campos inválidos.", 422, errors);
      }
    };
  }
}
