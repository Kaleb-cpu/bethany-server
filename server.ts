import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import cookie from "@fastify/cookie";

import { prismaGlobal as db } from "./lib/server/prismaGlobal";
import fastifyBetterAuth from "fastify-better-auth";
import { auth } from "./lib/server/auth";
import { APIError } from "better-auth/api";

const fastify = Fastify({
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty"
    }
  }
});


fastify.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN 
    ? process.env.CLIENT_ORIGIN.split(',') 
    : ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET, // for cookies signature
});


fastify.register(fastifyBetterAuth, { auth });


// async function testRequest() {
//   try {
//     await auth.api.signUpEmail({
//       body: {
//         name: "Kaleb",
//         email: "kakuj424@gmail.com",
//         password: "Welcome12."
//       }
//     })
//   } catch (error) {
//     if (error instanceof APIError) {
//       console.log(error.message, error.status)
//     }
//   }

// }

// testRequest();


  

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Fastify running on", address);
});
