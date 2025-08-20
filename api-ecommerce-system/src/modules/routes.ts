import { Router } from "express";
import { ValidationSchemaMiddleware } from "../common/middlewares/ValidationSchemaMiddleware";
import { VerifyTokenMiddleware } from "../common/middlewares/VerifyTokenMiddleware";
import { AuthControllerFactory } from "../factory/AuthControllerFactory";
import { BusinessesControllerFactory } from "../factory/BusinessesControllerFactory";
import { Schema } from "../schemas/Schema";
import { AuthController } from "./auth/AuthController";
import { BusinessController } from "./business/BusinessController";

export class Routes {
  protected authController: AuthController;
  protected businessController: BusinessController;

  constructor() {
    this.authController = AuthControllerFactory.execute();
    this.businessController = BusinessesControllerFactory.execute();
  }

  execute() {
    const router = Router();
    this.authRoutes(router);
    this.businessesRoutes(router);
    return router;
  }

  private authRoutes(router: Router) {
    router.post(
      "/signin",
      ValidationSchemaMiddleware.execute(Schema.signin()),
      this.authController.signin
    );
  }

  private businessesRoutes(router: Router) {
    router.post(
      "/business",
      VerifyTokenMiddleware.execute,
      ValidationSchemaMiddleware.execute(Schema.businessCreate()),
      this.businessController.create
    );

    router.put(
      "/business",
      VerifyTokenMiddleware.execute,
      ValidationSchemaMiddleware.execute(Schema.businessUpdate()),
      this.businessController.update
    );

    router.get(
      "/business",
      VerifyTokenMiddleware.execute,
      // ValidationSchemaMiddleware.execute(Schema.businessUpdate()),
      this.businessController.get
    );
  }
}
