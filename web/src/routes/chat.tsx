import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { AuthSession } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    if (!auth.isPending && !auth.data?.user) {
      throw redirect({
        to: "/",
      });
    }
  },
  loader: ({ context }) => {
    return {
      auth: {
        data: context.auth.data as AuthSession,
        refetch: context.auth.refetch,
      },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = useLoaderData({ from: "/chat" });
  const router = useRouter();

  const signout = useMutation({
    mutationFn: async () => {
      return await api.post("/auth/sign-out");
    },
    onSuccess: async () => {
      await auth.refetch();
      await router.invalidate();
      router.navigate({
        to: "/",
      });
    },
  });

  return (
    <div>
      <Button onClick={() => signout.mutate()}>Logout</Button>
    </div>
  );
}
