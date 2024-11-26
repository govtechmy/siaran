import { z } from "#extensions/zod";

const session = z.object({
  exp: z.number().openapi({
    description: "The expiration time of the token in milliseconds",
    example: 1690593600000,
  }),
  token: z.string().openapi({
    description: "The access token",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  }),
});

type Session = z.infer<typeof session>;
type SessionTokenOnly = Pick<Session, "token">;

export { session, type Session, type SessionTokenOnly };
