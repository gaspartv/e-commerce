import { UsersRepository } from "../database/repositories/Users/UsersRepository";
import { AuthController } from "../modules/auth/AuthController";
import { AuthService } from "../modules/auth/AuthService";

export class AuthControllerFactory {
  static execute() {
    const usersRepository = new UsersRepository();
    const authService = new AuthService(usersRepository);
    return new AuthController(authService);
  }
}
