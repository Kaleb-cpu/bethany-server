import { detectBot } from "@arcjet/fastify";
import { isMissingUserAgent, isSpoofedBot } from "@arcjet/inspect";
import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  const arcjet = fastify.arcjet.withRule(
    detectBot({
      mode: "LIVE",
      allow: [], // blocks all automated clients
    })
  );

  fastify.get("/bots", async (request, reply) => {
    const decision = await arcjet.protect(request);

    fastify.log.info(`Arcjet: id = ${decision.id}`);
    fastify.log.info(
      `Arcjet: decision = ${decision.conclusion}, reason = ${decision.reason.type}`
    );

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return reply
          .status(403)
          .header("Content-Type", "application/json")
          .send({ message: "No bots allowed" });
      }

      // If the request was denied for any other reason, return a 403 Forbidden
      return reply
        .status(403)
        .header("Content-Type", "application/json")
        .send({ message: "Forbidden" });
    }

    if (decision.results.some(isMissingUserAgent)) {
      fastify.log.warn("User-Agent header is missing");
      return reply
        .status(400)
        .header("Content-Type", "application/json")
        .send({ message: "Bad request" });
    }

    if (decision.isErrored()) {
      // Fail open to prevent an Arcjet error from blocking all requests. You
      // may want to fail closed if this controller is very sensitive
      fastify.log.error(`Arcjet error: ${decision.reason.message}`);
    }

    if (decision.results.some(isSpoofedBot)) {
      return reply
        .status(403)
        .header("Content-Type", "application/json")
        .send({ message: "Spoofed!" });
    }

    return reply
      .status(200)
      .header("Content-Type", "application/json")
      .send({ message: "Hello world" });
  });
}
