/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error: any) {
        const msg: { message: string }[] | string = error.response.data.message;

        let desc: ReactNode;
        if (Array.isArray(msg)) {
          desc = (
            <div className="flex flex-col gap-1 my-1">
              {msg.map((item, i) => (
                <p key={i} className="flex items-center gap-1">
                  <Dot className="size-4" /> <span>{item.message}</span>
                </p>
              ))}
            </div>
          );
        } else {
          desc = <p>{msg}</p>;
        }

        toast.error("Oops!!!", {
          description: desc,
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
