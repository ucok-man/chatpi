import type { useSession } from "@/lib/auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

type Context = {
  auth: ReturnType<typeof useSession>;
};

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <Outlet />
    </div>
  );
}
