'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './mockData';
import { loginAction, registerAction, logoutAction, getSessionAction } from './actions/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, role: 'executor' | 'employer') => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const sessionUser = await getSessionAction();
            setUser(sessionUser);
        } catch (error) {
            console.error('Failed to check session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, role: string) => {
        const result = await loginAction(email, role);
        if (result.success && result.user) {
            setUser(result.user);
        } else {
            throw new Error(result.error);
        }
    };

    const logout = async () => {
        await logoutAction();
        setUser(null);
    };

    const register = async (name: string, email: string, role: 'executor' | 'employer') => {
        const result = await registerAction(name, email, role);
        if (result.success && result.user) {
            setUser(result.user);
        } else {
            throw new Error(result.error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
