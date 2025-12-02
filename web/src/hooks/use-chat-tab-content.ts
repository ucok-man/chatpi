import { create } from "zustand";

type State = {
  tab: "contact" | "mychat";
};

type Action = {
  setTab: (tab: "contact" | "mychat") => void;
};

export const useChatTabContent = create<State & Action>((set) => ({
  tab: "contact",
  setTab: (tabname) => set(() => ({ tab: tabname })),
}));
