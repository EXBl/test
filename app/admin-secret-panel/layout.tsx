import React from 'react';
import Link from 'next/link';
import { getSessionAction } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSessionAction();

    if (!session || session.role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>Админ Панель</div>
                <nav className={styles.nav}>
                    <Link href="/admin-secret-panel" className={styles.link}>Дашборд</Link>
                    <Link href="/admin-secret-panel/jobs" className={styles.link}>Модерация</Link>
                    <Link href="/admin-secret-panel/users" className={styles.link}>Пользователи</Link>
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
