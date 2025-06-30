import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../interfaces/userInterface";

export interface authStoreInterface {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<authStoreInterface>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user: User) => set({ user }),
    }),
    { name: "auth" }
  )
);