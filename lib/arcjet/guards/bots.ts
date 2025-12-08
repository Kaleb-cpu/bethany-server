import { aj } from "../client";
import { detectBot } from "@arcjet/fastify";
import { FastifyRequest, FastifyReply } from "fastify";

export function botGuard() {
  // returns a Fastify preHandler
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const decision = await aj
      .withRule(detectBot({ mode: "LIVE", allow: [] }))
      .protect(request);

    if (decision.isDenied()) {
      reply.code(403).send({ error: "Automated client blocked" });
      return reply; // stop processing
    }
  };
}
