import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { localization } from "better-auth-localization";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    localization({
      defaultLocale: "fa-IR",
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "http://192.168.100.5:3000",
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    useSecureCookies: false, // Set to false for local development over HTTP
  },
});
