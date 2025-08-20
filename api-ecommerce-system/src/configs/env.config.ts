import "dotenv/config";
import * as yup from "yup";

const envSchema = yup.object({
  API_NAME: yup.string().required(),
  NODE_ENV: yup.string().oneOf(["develop", "homolog", "production"]).required(),
  PORT: yup.number().required(),
  FRONT_URL: yup.string().required(),
  DATABASE_URL: yup.string().required(),
  JWT_SECRET: yup.string().required(),
  JWT_EXPIRES_IN_TIME: yup.number().min(0).max(86400000).required(),
});

let env: yup.InferType<typeof envSchema>;

try {
  env = envSchema.validateSync(process.env, {
    abortEarly: false,
    stripUnknown: true,
  });
} catch (error) {
  if (error instanceof yup.ValidationError) {
    error.errors.forEach((err) => {
      console.error(err);
    });
  }
  process.exit(1);
}

export { env };
