import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@/hooks/use-chat";
import { api } from "@/lib/api";
import type { Metadata, Room, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useIntersectionObserver } from "usehooks-ts";

export default function TabContact() {
  const query = useSearch({ from: "/chat" });
  const { setSelectedRoomId } = useChat();
  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["contact:all", query.search],
    queryFn: async ({
      pageParam,
    }): Promise<{
      users: User[];
      meta: Metadata;
    }> => {
      return (
        await api.get(`/user?search=${query?.search ?? ""}&page=${pageParam}`)
      ).data;
    },
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => meta.nextPage,
  });

  const createPrivateRoom = useMutation({
    mutationFn: async (targetParticipantId: string) => {
      return await api
        .post("/room/private", {
          targetParticipantId,
        })
        .then((res) => res.data.room as Room);
    },
    onSuccess: ({ id }) => {
      setSelectedRoomId(id);
    },
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

  const users = data.pages.flatMap(({ users }) => users);

  return (
    <div className="space-y-4 h-[calc(100%-8rem)] overflow-y-scroll">
      {users.map((item) => (
        <div
          onClick={() => createPrivateRoom.mutate(item.id)}
          key={item.id}
          className={cn(
            "flex items-center gap-3 cursor-pointer hover:bg-green-50/10 rounded-full px-3 py-2",
            createPrivateRoom.isPending && "pointer-events-none"
          )}
        >
          <div className="border-2 border-neutral-700 rounded-full bg-background/50">
            <Avatar className="size-12">
              <AvatarImage src={item.image ?? ""} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col">
            <h3 className="text-base">{item.name}</h3>
            <p className="text-muted-foreground text-sm">{item.email}</p>
          </div>
        </div>
      ))}

      {/* Sentinel element for infinite scroll */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <p className="text-sm text-muted-foreground">Loading more...</p>
        )}
      </div>
    </div>
  );
}
