import { betterAuth } from "better-auth";
import { PrismaClient } from "../../prisma/generated/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"],
    EmailAndPassword: {
      enabled: true
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 50 // 5 minutes
      },
    }
});