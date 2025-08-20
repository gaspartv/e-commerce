import pgPromise from "pg-promise";
import { env } from "../configs/env.config";

const pgp = pgPromise();
const db = pgp(env.DATABASE_URL);

db.none("SET search_path TO public");

export default db;
