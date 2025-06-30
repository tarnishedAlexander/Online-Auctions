import { AxiosError } from 'axios';
import jsonServerInstance from '../api/jsonInstance';
import type { User } from '../interfaces/userInterface';

interface ApiError {
  message: string;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await jsonServerInstance.get("/users", {
        params: { email, password }
    });
    console.log("Server response:", response.data);
    return response.data[0];
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Credenciales incorrectas.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
};