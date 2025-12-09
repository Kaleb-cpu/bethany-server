// src/app.ts
import Fastify from "fastify";

// Cors and cookies
import fastifyCors from "@fastify/cors";
import cookie from "@fastify/cookie";

// Plugins
import arcjetPlugin from "./plugins/arcjet";

// Routes
import signup from "./routes/signup";
import signin from "./routes/signin";
import authPlugin from "./plugins/authPlugin";

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    },
  });

  // Origin validation
  fastify.register(fastifyCors, {
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });

  // Cookies
  fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
  });

  await fastify.register(arcjetPlugin);

  // Register routes
  fastify.register(signup);
  fastify.register(signin);
  fastify.register(authPlugin);

  return fastify;
}
