export const setStorage = (key: string, value: any) => {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

export const getStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
};

export const clearStorage = () => {
  localStorage.clear();
};
