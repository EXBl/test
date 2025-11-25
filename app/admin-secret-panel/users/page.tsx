'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/lib/mockData';
import { getAllUsersAction, updateUserPasswordAction } from '@/lib/actions/admin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'executor' | 'employer'>('executor');
    const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsersAction();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (userId: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(userId)) {
            newVisible.delete(userId);
        } else {
            newVisible.add(userId);
        }
        setVisiblePasswords(newVisible);
    };

    const handleSavePassword = async (userId: string) => {
        if (!newPassword) return;

        try {
            await updateUserPasswordAction(userId, newPassword);
            await loadUsers();
            setEditingPasswordId(null);
            setNewPassword('');
            alert('Пароль обновлен');
        } catch (error) {
            alert('Ошибка обновления пароля');
        }
    };

    const filteredUsers = users.filter(user => user.role === activeTab);

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Управление пользователями</h1>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <Button
                    variant={activeTab === 'executor' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('executor')}
                >
                    Исполнители
                </Button>
                <Button
                    variant={activeTab === 'employer' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('employer')}
                >
                    Работодатели
                </Button>
            </div>

            <Card padding="lg">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem' }}>Имя</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Пароль</th>
                            <th style={{ padding: '1rem' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>{user.name}</td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    {editingPasswordId === user.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Input
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Новый пароль"
                                                style={{ marginBottom: 0 }}
                                            />
                                            <Button size="sm" onClick={() => handleSavePassword(user.id)}>OK</Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingPasswordId(null)}>X</Button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>
                                                {user.password
                                                    ? (visiblePasswords.has(user.id) ? user.password : '••••••')
                                                    : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Нет пароля</span>}
                                            </span>
                                            {user.password && (
                                                <button
                                                    onClick={() => togglePasswordVisibility(user.id)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                                                >
                                                    {visiblePasswords.has(user.id) ? '👁️‍🗨️' : '👁️'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingPasswordId(user.id);
                                            setNewPassword('');
                                        }}
                                    >
                                        Изменить пароль
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                    Пользователи не найдены
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
