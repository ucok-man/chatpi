import SideNavigation from "@/components/chat/side-navigation";
import TabContent from "@/components/chat/tab-content";
import type { AuthSession } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

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
  validateSearch: z.object({
    search: z.string().optional().nullish(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row h-screen w-full">
      <SideNavigation />
      <TabContent />
      <div>[CHAT BOX]</div>
    </div>
  );
}
