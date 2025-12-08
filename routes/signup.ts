// routes/signup.ts
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { signupGuard } from "../lib/arcjet/guards/signupGuard";
import { auth } from "../lib/authentication/auth";

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export default async function signupRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: SignupBody }>(
    "/api/auth/sign-up/email",
    async (request, reply) => {
      // --- Arcjet security check ---
      const arcjetDecision = await signupGuard(request, reply);
      if (reply.sent) return; // stop if Arcjet blocked the request

      // --- Extract body for BetterAuth ---
      const { name, email, password } = request.body;

      try {
        // Call BetterAuth signup
        const result = await auth.api.signUpEmail({
          body: { name, email, password },
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
          "Signup completed successfully"
        );

        return reply.send({
          message: "Signup successful",
          userId: result.response,
        });
      } catch (err: any) {
        fastify.log.error(
          {
            error: err,
            email,
          },
          "Signup failed in BetterAuth"
        );

        return reply.code(400).send({
          error: "Signup failed",
          details: err?.message,
        });
      }
    }
  );
}
