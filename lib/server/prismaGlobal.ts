/*
  We are creating a global instance for our prisma client that we can 
  use throughout our application to connect and communicate with our database.
 */
import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/prisma-client";
declare global {
  // Avoid multiple client instances in dev
  var __prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg(
  { connectionString },
  { schema: "artists" }
);
export const prismaGlobal =
  globalThis.__prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV === "development") globalThis.__prisma = prismaGlobal;


