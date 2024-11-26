import { agency } from "#cms/schema/agency";
import { z } from "#extensions/zod";

const role = z.enum(["admin", "superadmin"]);

const user = z.object({
  id: z.string(),
  email: z.string().email(),
  role,
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  agency,
  loginAttempts: z.number().min(0),
});

type User = z.infer<typeof user>;
type Role = z.infer<typeof role>;

export { user, role, type User, type Role };
