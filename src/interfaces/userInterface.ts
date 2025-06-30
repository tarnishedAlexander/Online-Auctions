export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: 'user' | 'admin';
  token: string;
}
