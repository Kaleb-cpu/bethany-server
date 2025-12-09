import { FastifyInstance } from "fastify";
import limitRate from "../lib/arcjet/guards/rateLimit";
import { auth } from "../lib/authentication/auth";

interface SignInBody {
  email: string;
  password: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: SignInBody }>(
    "/api/auth/sign-in/email",
    async (request, reply) => {
      const arcjetDecision = await limitRate(request, reply);
      if (reply.sent) return;

      //   Extract body for better-auth
      const { email, password } = request.body;

      try {
        const result = await auth.api.signInEmail({
          body: { email, password },
          returnHeaders: true,
        });
        const setCookie = result.headers?.get("set-cookie");
        if (setCookie) {
          reply.header("set-cookie", setCookie);
        }
        // --- Log everything neatly ---
        fastify.log.info(
          {
            arcjet: {
              decision: arcjetDecision.conclusion,
              reason: arcjetDecision.reason.type,
              id: arcjetDecision.id,
            },
            betterAuth: {
              result,
              userEmail: email,
            },
          },
          "Signin completed successfully"
        );

        return reply.send({
          message: "Signin successful",
          userId: result.response,
        });
      } catch (err: any) {
        fastify.log.error(
          {
            error: err,
            email,
          },
          "Signin failed in BetterAuth"
        );

        return reply.code(400).send({
          error: "Signin failed",
          details: err?.message,
        });
      }
    }
  );
}
