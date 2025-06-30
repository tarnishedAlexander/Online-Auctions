import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/userInterface";
import { clearStorage, setStorage } from "../helpers/localStorage";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuth] = useState<boolean>(false);
  const login = (user: User) => {
    setStorage("user", user);
    setStorage("token", user.token);

    setUser(user);
    setIsAuth(true);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    setIsAuth(false);
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, setUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
