import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { UserPayload } from '@/types';

// Simulate user database - structure: "email#role" as key
const users: Record<string, any> = {};
let userId = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, name, and password required' },
        { status: 400 }
      );
    }

    // Always register as 'user' role - admin registration is NOT allowed
    const role = 'user';

    // Check if email + role combination exists
    const userKey = `${email}#${role}`;
    if (users[userKey]) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered' },
        { status: 400 }
      );
    }

    const newUser = {
      id: (userId++).toString(),
      email,
      name,
      password, // In production: bcrypt hashed
      role,
    };

    users[userKey] = newUser;

    const payload: UserPayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = generateToken(payload);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
