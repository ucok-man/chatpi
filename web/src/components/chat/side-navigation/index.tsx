import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatNavigationStore } from "@/hooks/use-chat-navigation-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import { LogOut, MessageCircleMore, Users } from "lucide-react";

export default function SideNavigation() {
  const { auth } = useLoaderData({ from: "/chat" });
  const router = useRouter();
  const { setTab, tab } = useChatNavigationStore();

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
    <div className="w-fit h-full px-3 py-6 border-r border-border">
      <div className="flex flex-col h-full">
        {/* TOP */}
        <nav className="flex-1 flex flex-col gap-6">
          <div
            onClick={() => setTab("chat")}
            className={cn(
              "cursor-pointer text-muted-foreground",
              tab === "chat" && "text-green-600"
            )}
          >
            <MessageCircleMore className="size-5.5" />
          </div>

          <div
            onClick={() => setTab("contact")}
            className={cn(
              "cursor-pointer text-muted-foreground",
              tab === "contact" && "text-green-600"
            )}
          >
            <Users className="size-5.5" />
          </div>
        </nav>

        {/* Bottom */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-2 border-neutral-700 rounded-full bg-background/50 cursor-pointer">
              <Avatar className="size-7">
                <AvatarImage src={auth.data?.user.image ?? ""} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-xl shadow-lg border animate-in slide-in-from-top-2 duration-200"
              side="right"
              align="end"
              sideOffset={8}
            >
              {/* User info header */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                  <div className="border-2 border-neutral-700 rounded-full bg-background/50 cursor-pointer">
                    <Avatar className="size-8">
                      <AvatarImage src={auth.data?.user.image ?? ""} />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid text-left leading-tight min-w-0 flex-1">
                    <span className="truncate text-sm font-medium text-foreground">
                      {auth.data?.user.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground mt-0.5">
                      {auth.data?.user.email || "No email"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <div className="py-2">
                <DropdownMenuItem
                  onClick={() => signout.mutate()}
                  className="group flex items-center gap-3 px-4 py-2.5 cursor-pointer focus:bg-destructive/10 focus:text-destructive/80 transition-colors"
                >
                  <LogOut className="size-4.5 transition-colors" />
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
