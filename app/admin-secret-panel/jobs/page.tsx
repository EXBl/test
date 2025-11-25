'use client';

import React, { useEffect, useState } from 'react';
import { JobWithStatus } from '@/lib/db';
import { getPendingJobsAction, approveJobAction, rejectJobAction } from '@/lib/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function JobModerationPage() {
    const [jobs, setJobs] = useState<JobWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const pendingJobs = await getPendingJobsAction();
            setJobs(pendingJobs);
        } catch (error) {
            console.error('Failed to load pending jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        await approveJobAction(id);
        setJobs(jobs.filter(job => job.id !== id));
    };

    const handleReject = async (id: string) => {
        await rejectJobAction(id);
        setJobs(jobs.filter(job => job.id !== id));
    };

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>Модерация вакансий</h1>

            {jobs.length === 0 ? (
                <Card padding="lg">
                    <p>Нет вакансий на модерации.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {jobs.map(job => (
                        <Card key={job.id} padding="lg">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{job.title}</h3>
                                    <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>{job.company} • {job.location}</p>
                                    <p style={{ marginBottom: '1rem' }}>{job.description.substring(0, 150)}...</p>
                                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                        Размещено: {job.postedAt} | Категория: {job.category}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button variant="outline" onClick={() => handleReject(job.id)}>Отклонить</Button>
                                    <Button onClick={() => handleApprove(job.id)}>Одобрить</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
