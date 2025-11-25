'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    JobBoard
                </Link>

                <nav className={styles.nav}>
                    <Link href="/jobs" className={styles.link}>Find Jobs</Link>
                    {user?.role === 'employer' && (
                        <Link href="/dashboard" className={styles.link}>Post Job</Link>
                    )}
                </nav>

                <div className={styles.auth}>
                    {user ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userName}>{user.name}</span>
                            <Button variant="outline" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Link href="/login">
                                <Button variant="outline" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
