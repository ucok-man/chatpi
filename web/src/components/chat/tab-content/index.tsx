import SearchBox from "@/components/search-box";
import { useChatNavigationStore } from "@/hooks/use-chat-navigation-store";
import TabChat from "../tab-chat";
import TabContact from "../tab-contact";

export default function TabContent() {
  const { tab } = useChatNavigationStore();

  return (
    <div className="h-full px-3 py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold ">ChatApp</h2>
      </div>

      <div className="mb-6">
        <SearchBox />
      </div>

      {tab === "chat" && <TabChat />}
      {tab === "contact" && <TabContact />}
    </div>
  );
}
