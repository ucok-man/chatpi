import TanstackQuery from "@/components/provider/tanstack-query";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <TanstackQuery>
      <Outlet />
      <Toaster />
    </TanstackQuery>
  );
}
