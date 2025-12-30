import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedChat } from "@/hooks/use-selected-chat";
import { useLoaderData } from "@tanstack/react-router";

export default function ChatbotHeader() {
  const { room } = useSelectedChat();
  const { auth } = useLoaderData({ from: "/chat" });

  const targetUser = room?.participants.find((p) => p.id !== auth.data.user.id);

  return (
    <header className="w-full shadow py-2.5 bg-background">
      <div className="size-full flex flex-col justify-center px-4">
        {/* Left Side */}
        <div className="flex items-center gap-2.5">
          <Avatar className="size-12 border-2 border-neutral-700">
            <AvatarImage src={targetUser?.image ?? ""} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>

          <p className="font-medium">{targetUser?.name}</p>
        </div>

        {/* Right Side */}
      </div>
    </header>
  );
}
