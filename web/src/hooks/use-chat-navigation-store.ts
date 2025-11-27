import { create } from "zustand";

type State = {
  tab: "contact" | "chat";
};

type Action = {
  setTab: (tab: "contact" | "chat") => void;
};

export const useChatNavigationStore = create<State & Action>((set) => ({
  tab: "contact",
  setTab: (tabname) => set(() => ({ tab: tabname })),
}));
