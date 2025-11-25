'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/lib/mockData';
import { getAllUsersAction } from '@/lib/actions/admin';
import { Card } from '@/components/ui/Card';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
        loadUsers();
    }, []);

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Управление пользователями</h1>

            <Card padding="lg">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem' }}>Имя</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Роль</th>
                            <th style={{ padding: '1rem' }}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>{user.name}</td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: user.role === 'employer' ? '#dbeafe' : user.role === 'admin' ? '#fce7f3' : '#dcfce7',
                                        color: user.role === 'employer' ? '#1e40af' : user.role === 'admin' ? '#be185d' : '#166534'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>{user.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
