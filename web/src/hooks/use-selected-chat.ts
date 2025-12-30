import type { Room, User } from "@/lib/types";
import { create } from "zustand";

type State = {
  room: (Room & { participants: User[] }) | null;
};

type Action = {
  setRoom: (id: (Room & { participants: User[] }) | null) => void;
};

export const useSelectedChat = create<State & Action>((set) => ({
  room: null,
  setRoom: (room: (Room & { participants: User[] }) | null) =>
    set(() => ({ room })),
}));
