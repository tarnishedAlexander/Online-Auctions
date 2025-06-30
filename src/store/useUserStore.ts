import { create } from "zustand";
import type { User } from "../interfaces/userInterface";
import { getAllUsers, getUser, createUser, editUser, deleteUser } from "../services/userService";

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<User | null>;
  createUser: (formData: FormData) => Promise<void>;
  editUser: (user: User, file?: File) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getAllUsers();
      set({ users: response });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al obtener los usuarios";
      set({ error: errorMessage, users: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUser: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await getUser(id);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al obtener el usuario";
      set({ error: errorMessage });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  createUser: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createUser(formData);
      set((state) => ({
        users: [...state.users, response],
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear el usuario";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  editUser: async (user: User, file?: File) => {
    try {
      set({ isLoading: true, error: null });
      const response = await editUser(user, file);
      set((state) => ({
        users: state.users.map((u) => (u.id === user.id ? response : u)),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el usuario";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar el usuario";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));