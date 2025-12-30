import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedChat } from "@/hooks/use-selected-chat";
import { api } from "@/lib/api";
import type { Message, Metadata, Room, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLoaderData, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useIntersectionObserver } from "usehooks-ts";

export default function LeftContentMyChat() {
  const { auth } = useLoaderData({ from: "/chat" });
  const query = useSearch({ from: "/chat" });

  const { setRoom, room } = useSelectedChat();

  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["mychat:all", query.search],
    queryFn: async ({
      pageParam,
    }): Promise<{
      rooms: (Room & { lastMessage: Message | null } & {
        participants: User[];
      })[];
      meta: Metadata;
    }> => {
      return (
        await api.get(`/rooms?search=${query?.search ?? ""}&page=${pageParam}`)
      ).data;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => meta.nextPage,
  });

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });

  // Trigger fetchNextPage when the sentinel element is visible
  if (isIntersecting && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") {
    toast.error("Oops!!", {
      description: "Something went wrong!",
    });
    return <div>Loading...</div>;
  }

  const mychats = data.pages.flatMap(({ rooms }) => rooms);

  // TODO: change to handle group chat also
  // TODO: complete the ui, add created last message at.
  return (
    <div className="space-y-4 h-[calc(100%-8rem)] overflow-y-scroll">
      {mychats.map((item) => {
        const targetUser = item.participants
          .filter((item) => item.id !== auth.data.user.id)
          .at(0);

        return (
          <div
            onClick={() => setRoom(item)}
            key={item.id}
            className={cn(
              "flex items-center gap-3 cursor-pointer hover:bg-green-50/10 rounded-full px-3 py-2",
              room?.id === item.id && "bg-green-50/10"
            )}
          >
            <div className="border-2 border-neutral-700 rounded-full bg-background/50">
              <Avatar className="size-12">
                <AvatarImage src={targetUser?.image ?? ""} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col">
              <h3 className="text-base">{targetUser?.name}</h3>
              {item.lastMessage?.content && (
                <p className="text-muted-foreground text-sm truncate">
                  {item.lastMessage?.content}
                </p>
              )}
              {item.lastMessage?.image && <p>Last message is image: TODO</p>}
            </div>
          </div>
        );
      })}

      {/* Sentinel element for infinite scroll */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <p className="text-sm text-muted-foreground">Loading more...</p>
        )}
      </div>
    </div>
  );
}
