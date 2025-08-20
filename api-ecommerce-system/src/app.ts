import cors from "cors";
import "dotenv/config";
import express from "express";
import { handleError } from "./app.error";
import { env } from "./configs/env.config";
import { Routes } from "./modules/routes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const routes = new Routes();
app.use("/", routes.execute());
app.use(handleError);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
