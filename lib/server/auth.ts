import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaGlobal as db } from "./prismaGlobal";
import "dotenv/config";

export const auth = betterAuth({
trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
  // Database adapter
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  user: {
    modelName: "Artist",
    fields: {
      id: "id",
      name: "name",
      email: "email",
      image: "profile_image_url",
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
      accounts: "accounts",
      sessions: "sessions",
    },
  },

  account: {
    modelName: "Account",
    fields: {
      id: "id",
      accountId: "accountId",
      providerId: "providerId",
      userId: "artistId", 
      user: "artist", 
      password: "password",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },

  session: {
    modelName: "Session",
    fields: {
      id: "id",
      expiresAt: "expiresAt",
      token: "token",
      userId: "artistId", 
      user: "artist",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
    },
    expiresIn: 604800,
  },


  emailAndPassword: {
    enabled: true,
  },

});
