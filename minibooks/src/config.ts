import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("環境変数エラー:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const config = parsed.data;
