'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'executor' | 'employer'>('executor');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await register(name, email, role);
            if (role === 'employer') {
                router.push('/dashboard');
            } else {
                router.push('/jobs');
            }
        } catch (error) {
            alert('Ошибка регистрации.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card} padding="lg">
                <h1 className={styles.title}>Регистрация</h1>

                <div className={styles.roleToggle}>
                    <button
                        className={`${styles.roleButton} ${role === 'executor' ? styles.active : ''}`}
                        onClick={() => setRole('executor')}
                        type="button"
                    >
                        Исполнитель
                    </button>
                    <button
                        className={`${styles.roleButton} ${role === 'employer' ? styles.active : ''}`}
                        onClick={() => setRole('employer')}
                        type="button"
                    >
                        Работодатель
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Имя"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" isLoading={isLoading} fullWidth>
                        Зарегистрироваться
                    </Button>
                </form>

                <p className={styles.footer}>
                    Уже есть аккаунт? <Link href="/login">Войти</Link>
                </p>
            </Card>
        </div>
    );
}
