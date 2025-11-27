import { createRouter, RouterProvider } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect } from "react";
import TanstackQuery from "./components/provider/tanstack-query";
import { Toaster } from "./components/ui/sonner";
import { useSession } from "./lib/auth";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const auth = useSession();
  useEffect(() => {
    router.invalidate();
  }, [auth.isPending]);

  return (
    <TanstackQuery>
      <NuqsAdapter>
        <RouterProvider router={router} context={{ auth }} />
        <Toaster />
      </NuqsAdapter>
    </TanstackQuery>
  );
}
