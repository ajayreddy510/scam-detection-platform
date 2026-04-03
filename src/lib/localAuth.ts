// Local user store for when Firebase is not available
const LOCAL_USERS_KEY = 'safehire_users';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
}

const isClient = () => typeof window !== 'undefined';

export const getLocalUsers = (): LocalUser[] => {
  try {
    if (!isClient()) return [];
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting local users:', error);
    return [];
  }
};

export const saveLocalUser = (user: Omit<LocalUser, 'id'>): LocalUser => {
  try {
    if (!isClient()) throw new Error('Not on client side');
    
    const users = getLocalUsers();
    const newUser: LocalUser = {
      ...user,
      id: Date.now().toString(),
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return newUser;
  } catch (error) {
    console.error('Error saving local user:', error);
    throw error;
  }
};

export const findLocalUser = (email: string, password: string): LocalUser | null => {
  try {
    if (!isClient()) return null;
    
    const users = getLocalUsers();
    const found = users.find(u => u.email === email && u.password === password) || null;
    return found;
  } catch (error) {
    console.error('Error finding local user:', error);
    return null;
  }
};

export const userExists = (email: string): boolean => {
  try {
    if (!isClient()) return false;
    
    const users = getLocalUsers();
    return users.some(u => u.email === email);
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};
