import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

export default function TabContact() {
  const query = useSearch({ from: "/chat" });

  const { data, isPending, error } = useQuery({
    queryKey: ["contact:all", query.search],
    queryFn: async () => {
      if (query.search) {
        return (await api.get(`/user?search=${query.search}`)).data as User[];
      } else {
        return (await api.get(`/user`)).data as User[];
      }
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (error) {
    toast.error("Oops!!", {
      description: "Something went wrong!",
    });
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 cursor-pointer hover:bg-green-50/10 rounded-full px-3 py-2"
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
    </div>
  );
}
