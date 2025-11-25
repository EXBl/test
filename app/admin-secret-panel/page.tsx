import React from 'react';
import { Card } from '@/components/ui/Card';
import { getAdminStatsAction } from '@/lib/actions/admin';

export default async function AdminDashboard() {
    const stats = await getAdminStatsAction();

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Дашборд</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <Card padding="lg">
                    <h3>Ожидают модерации</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>{stats.pendingJobs}</p>
                </Card>
                <Card padding="lg">
                    <h3>Всего пользователей</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>{stats.totalUsers}</p>
                </Card>
            </div>
        </div>
    );
}
