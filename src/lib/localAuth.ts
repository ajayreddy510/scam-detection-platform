// Local user store for when Firebase is not available
const LOCAL_USERS_KEY = 'safehire_users';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
}

export const getLocalUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LOCAL_USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLocalUser = (user: Omit<LocalUser, 'id'>): LocalUser => {
  const users = getLocalUsers();
  const newUser: LocalUser = {
    ...user,
    id: Date.now().toString(),
  };
  users.push(newUser);
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const findLocalUser = (email: string, password: string): LocalUser | null => {
  const users = getLocalUsers();
  return users.find(u => u.email === email && u.password === password) || null;
};

export const userExists = (email: string): boolean => {
  const users = getLocalUsers();
  return users.some(u => u.email === email);
};
