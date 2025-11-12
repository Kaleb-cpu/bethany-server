 /*
  We are creating a global instance for our prisma client that we can 
  use throughout our application to connect and communicate with our database.
 */
import { PrismaClient } from '../../prisma/generated/client';
declare global {
  // Avoid multiple client instances in dev
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV === 'development') globalThis.__prisma = prisma;
