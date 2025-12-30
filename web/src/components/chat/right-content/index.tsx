import { useSelectedChat } from "@/hooks/use-selected-chat";
import ChatboxContent from "./chatbox-content";
import ChatbotHeader from "./chatbox-header";
import EmptyChat from "./empty-chat";

export default function RightContent() {
  const { room } = useSelectedChat();

  if (!room) return <EmptyChat />;

  return (
    <div className="relative size-full flex flex-col">
      <div className="bg-[url('/chatbox-background.png')] bg-repeat size-full -z-10 opacity-10 fixed" />
      <ChatbotHeader />
      <ChatboxContent />
    </div>
  );
}
