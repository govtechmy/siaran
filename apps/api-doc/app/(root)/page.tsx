import { getPath } from "@/lib/path";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(getPath("/ms-MY/docs/auth/login/"));
}
