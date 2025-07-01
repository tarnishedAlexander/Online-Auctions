import { createContext, useContext } from "react";
import type { User } from "../interfaces/userInterface";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

export const useUser = () => useContext(UserContext);
