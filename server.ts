// src/server.ts
import { buildApp } from "./app";

async function start() {
  const fastify = await buildApp();

  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
