import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/auth';
import { UserPayload } from '@/types';

// Simulate user database for regular users only
const users: Record<string, any> = {
  'demo@example.com#user': {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'demo123', // In production: bcrypt hashed
    role: 'user',
  },
};

// FIXED ADMIN CREDENTIALS - Only way to access admin account
const ADMIN_EMAIL = 'reddyajay510@gmail.com';
const ADMIN_PASSWORD = 'Ajay#2004';
const ADMIN_USER = {
  id: '999',
  email: ADMIN_EMAIL,
  name: 'Admin',
  password: ADMIN_PASSWORD,
  role: 'admin',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = 'user' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    let user;

    // Check for admin login with fixed credentials
    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        user = ADMIN_USER;
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid admin credentials' },
          { status: 401 }
        );
      }
    } else {
      // Look up regular user by email#role
      const userKey = `${email}#${role}`;
      user = users[userKey];
      if (!user || user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
