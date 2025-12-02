import { create } from "zustand";

type State = {
  selectedRoomId: string | null;
};

type Action = {
  setSelectedRoomId: (id: string | null) => void;
};

export const useChat = create<State & Action>((set) => ({
  selectedRoomId: null,
  setSelectedRoomId: (id) => set(() => ({ selectedRoomId: id })),
}));
