import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error) {
        toast.error(error.name, {
          description: error.message,
        });
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

export default function TanstackQuery({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
