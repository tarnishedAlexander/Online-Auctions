export const setStorage = (key: string, value: any) => {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key); // Elimina la clave si el valor es undefined o null
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === "undefined") {
      return null; // Devuelve null si la clave no existe o tiene el valor "undefined"
    }
    return JSON.parse(value);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

export const clearStorage = () => {
  localStorage.clear();
};
