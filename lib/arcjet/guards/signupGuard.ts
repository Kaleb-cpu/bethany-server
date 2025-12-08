import { protectSignup } from "@arcjet/fastify";
import { isMissingUserAgent } from "@arcjet/inspect";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export async function signupGuard(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  const arcjet = request.server.arcjet.withRule(
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: ["CURL"],
      },
      rateLimit: {
        mode: "LIVE",
        interval: "2m",
        max: 5,
      },
    })
  );

  // Protect using the rule instance
  const decision = await arcjet.protect(request, {
    email: request.body.email,
  });

  request.server.log.info(`Arcjet: id = ${decision.id}`);
  request.server.log.info(
    `Arcjet: decision = ${decision.conclusion}, reason = ${decision.reason.type}`
  );

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return reply.status(403).send({ message: "No bots allowed" });
    }

    if (decision.reason.isRateLimit()) {
      return reply.status(429).send({ message: "Too many requests" });
    }

    if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "email address format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "we do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "your email domain does not have an MX record. Is there a typo?";
      } else {
        message = "invalid email.";
      }

      return reply.status(400).send({ message: `Error: ${message}` });
    }

    return reply.status(403).send({ message: "Forbidden" });
  }

  if (decision.results.some(isMissingUserAgent)) {
    request.server.log.warn("User-Agent header is missing");
    return reply.status(400).send({ message: "Bad request" });
  }

  if (decision.isErrored()) {
    request.server.log.error(`Arcjet error: ${decision.reason.message}`);
  }

  return decision;
}
