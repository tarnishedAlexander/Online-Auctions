import jsonServerInstance from "../api/jsonInstance";
import type { User } from "../interfaces/userInterface";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await jsonServerInstance.get("/users");
  if (!Array.isArray(response.data)) {
    throw new Error("Formato de datos inválido recibido del servidor");
  }
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await jsonServerInstance.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await jsonServerInstance.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
};

export const editUser = async (user: User): Promise<User> => {
  try {
    const response = await jsonServerInstance.put(`/users/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  await jsonServerInstance.delete(`/users/${id}`);
};