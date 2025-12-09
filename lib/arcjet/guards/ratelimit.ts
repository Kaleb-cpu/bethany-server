import { fixedWindow } from "@arcjet/fastify";
import { FastifyRequest, FastifyReply } from "fastify";

export default async function (
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  const arcjet = request.server.arcjet.withRule(
    fixedWindow({
      mode: "LIVE",
      max: 3,
      window: "60s",
    })
  );

  const decision = await arcjet.protect(request);

  request.server.log.info(`arcjet: id = ${decision.id}`);
  request.server.log.info(
    `Arcjet: decision = ${decision.conclusion}, reason = ${decision.reason.type}`
  );

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return reply
        .status(429)
        .header("Content-Type", "application/json")
        .send({ message: "Too many requests" });
    }

    // If the request was denied for any other reason, return a 403 Forbidden
    return reply
      .status(403)
      .header("Content-Type", "application/json")
      .send({ message: "Forbidden" });
  }

  if (decision.isErrored()) {
    // Fail open to prevent an Arcjet error from blocking all requests. You
    // may want to fail closed if this controller is very sensitive
    request.server.log.error(`Arcjet error: ${decision.reason.message}`);
  }

  return decision;
}
