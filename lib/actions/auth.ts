'use server';

import { db } from '../db';
import { User } from '../mockData';
import { cookies } from 'next/headers';

export async function loginAction(email: string, role: string) {
    const users = await db.getUsers();
    // Find user by email only
    const user = users.find(u => u.email === email);

    if (user) {
        // In a real app, check password here.
        // We allow login if user exists.
        cookies().set('session', JSON.stringify(user), { httpOnly: true });
        return { success: true, user };
    }

    return { success: false, error: 'Invalid credentials' };
}

export async function registerAction(name: string, email: string, role: 'executor' | 'employer') {
    const users = await db.getUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        return { success: false, error: 'User already exists' };
    }

    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
    };

    await db.createUser(newUser);
    cookies().set('session', JSON.stringify(newUser), { httpOnly: true });

    return { success: true, user: newUser };
}

export async function logoutAction() {
    cookies().delete('session');
    return { success: true };
}

export async function getSessionAction() {
    const session = cookies().get('session');
    if (session) {
        return JSON.parse(session.value) as User;
    }
    return null;
}
