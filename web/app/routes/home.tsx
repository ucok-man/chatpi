import { useSession } from "@/lib/auth-client";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Chatpi" }, { name: "description", content: "Uhuy" }];
}

export default function Home() {
  const session = useSession();
  console.log({ session });

  return <div>AWWW</div>;
}
