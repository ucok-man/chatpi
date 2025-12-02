import SearchBox from "@/components/search-box";
import { useChatTabContent } from "@/hooks/use-chat-tab-content";
import TabContact from "../tab-contact";
import TabMyChat from "../tab-mychat";

export default function TabContent() {
  const { tab } = useChatTabContent();

  return (
    <div className="h-full px-3 py-6 border-r-2 border-border">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold ">ChatApp</h2>
      </div>

      <div className="mb-6">
        <SearchBox />
      </div>

      {tab === "mychat" && <TabMyChat />}
      {tab === "contact" && <TabContact />}
    </div>
  );
}
