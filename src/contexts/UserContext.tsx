import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/userInterface";
import { clearStorage, setStorage, getStorage } from "../helpers/localStorage";
import { UserContext } from "./UserContextHelper";
import { useAuthStore } from "../store/authStore";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isAuthenticated: authIsAuthenticated } =
    useAuthStore();
  const [user, setUser] = useState<User | null>(authUser);
  const [isAuthenticated, setIsAuth] = useState<boolean>(authIsAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = getStorage("user");
        const token = getStorage("token");
        console.log("Stored user:", storedUser, "Token:", token); // Depuración

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuth(true);
        } else if (authUser && authIsAuthenticated) {
          setUser(authUser);
          setIsAuth(authIsAuthenticated);
          setStorage("user", authUser);
          setStorage("token", authUser.token);
        } else {
          setUser(null);
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        clearStorage();
        setUser(null);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [authUser, authIsAuthenticated]);

  const login = (user: User) => {
    setStorage("user", user);
    setStorage("token", user.token);
    setUser(user);
    setIsAuth(true);
    useAuthStore.getState().login(user);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    setIsAuth(false);
    useAuthStore.getState().logout();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, setUser, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
