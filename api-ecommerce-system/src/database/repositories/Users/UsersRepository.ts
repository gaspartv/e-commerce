import db from "../../db";

export class UsersRepository {
  findByEmail(email: string) {
    return db.oneOrNone("SELECT * FROM users_system WHERE email = $1", [email]);
  }
}
