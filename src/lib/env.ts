import {z} from "zod";

const envSchema = z
  .object({
    REMOTION_AWS_ACCESS_KEY_ID: z.string().min(1),
    REMOTION_AWS_SECRET_ACCESS_KEY: z.string().min(1),
    REMOTION_AWS_REGION: z.string().min(1),
    REMOTION_AWS_FUNCTION_NAME: z.string().min(1),
    REMOTION_SERVE_URL: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "production"]).default("development"),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.NEXT_PUBLIC_APP_ENV === "production") {
      if (!values.UPSTASH_REDIS_REST_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["UPSTASH_REDIS_REST_URL"],
          message: "UPSTASH_REDIS_REST_URL is required in production",
        });
      }
      if (!values.UPSTASH_REDIS_REST_TOKEN) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["UPSTASH_REDIS_REST_TOKEN"],
          message: "UPSTASH_REDIS_REST_TOKEN is required in production",
        });
      }
    }
  });

export const env = envSchema.parse(process.env);
export const __PROD__ = env.NEXT_PUBLIC_APP_ENV === "production";
