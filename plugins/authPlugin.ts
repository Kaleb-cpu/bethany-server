// plugins/authPlugin.ts
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import FastifyBetterAuth from "fastify-better-auth";
import { auth } from "../lib/authentication/auth"; // adjust path

async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(FastifyBetterAuth, { auth });
}

export default fp(authPlugin, { name: "auth-plugin" });
