// plugins/arcjet.ts
import fp from "fastify-plugin";
import arcjetFastify, { type ArcjetFastify } from "@arcjet/fastify";
import fastifyEnv from "@fastify/env";
import type { FastifyInstance } from "fastify";

// Extend FastifyInstance with TypeScript types
declare module "fastify" {
  interface FastifyInstance {
    arcjet: ArcjetFastify<unknown>;
    config: {
      ARCJET_KEY?: string;
    };
  }
}

async function arcjetPlugin(fastify: FastifyInstance, _options: unknown) {
  // Register environment variables
  await fastify.register(fastifyEnv, {
    schema: {
      type: "object",
      properties: {
        ARCJET_KEY: { type: "string" },
      },
    },
  });

  if (!fastify.config.ARCJET_KEY) {
    fastify.log.warn(
      "Sign up for free at https://app.arcjet.com to get your key."
    );
    throw new Error("Missing the ARCJET_KEY environment variable.");
  }

  // Decorate Fastify instance with Arcjet
  fastify.decorate(
    "arcjet",
    arcjetFastify({
      key: fastify.config.ARCJET_KEY,
      rules: [],
      log: fastify.log,
    })
  );
}

// 🔥 THIS IS THE FIX 🔥
export default fp(arcjetPlugin);
