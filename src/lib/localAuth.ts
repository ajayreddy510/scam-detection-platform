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
  try {
    if (typeof window === 'undefined') return [];
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
    const users = getLocalUsers();
    const newUser: LocalUser = {
      ...user,
      id: Date.now().toString(),
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    console.log('✅ User saved:', newUser.email);
    return newUser;
  } catch (error) {
    console.error('Error saving local user:', error);
    throw error;
  }
};

export const findLocalUser = (email: string, password: string): LocalUser | null => {
  try {
    const users = getLocalUsers();
    const found = users.find(u => u.email === email && u.password === password) || null;
    if (found) {
      console.log('✅ User found:', email);
    } else {
      console.log('❌ User not found:', email);
    }
    return found;
  } catch (error) {
    console.error('Error finding local user:', error);
    return null;
  }
};

export const userExists = (email: string): boolean => {
  try {
    const users = getLocalUsers();
    const exists = users.some(u => u.email === email);
    console.log(exists ? `⚠️ User exists: ${email}` : `✅ Email available: ${email}`);
    return exists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};
