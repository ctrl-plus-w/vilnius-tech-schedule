import { z } from 'zod';
import { configDotenv } from 'dotenv';

configDotenv();

export const EnvSchema = z.object({
  USER_ID: z.string(),
  PASSWORD: z.string(),
});

const ENV = EnvSchema.parse({
  USER_ID: process.env.USER_ID,
  PASSWORD: process.env.PASSWORD,
});

export default ENV;
