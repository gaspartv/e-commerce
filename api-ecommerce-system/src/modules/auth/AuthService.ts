import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AppError } from "../../app.error";
import { env } from "../../configs/env.config";
import { UsersRepository } from "../../database/repositories/Users/UsersRepository";
import { SigninDto } from "./interfaces/signin.interface";
import { SigninResponse } from "./interfaces/signin.response";

export class AuthService {
  protected usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async signin(dto: SigninDto): Promise<SigninResponse> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) throw new AppError("Senha ou email incorretos.", 403);

    const passwordMatch: boolean = await compare(dto.password, user.password);
    if (!passwordMatch) throw new AppError("Senha ou email incorretos.", 403);

    const payload = {
      iss: env.API_NAME,
      sub: user.id,
    };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });

    return { token, refreshToken };
  }
}
