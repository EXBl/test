'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CATEGORIES } from '@/lib/mockData';
import { createJobAction, getEmployerJobsAction, updateJobAction } from '@/lib/actions/jobs';
import { JobWithStatus } from '@/lib/db';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [jobs, setJobs] = useState<JobWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        category: CATEGORIES[1],
        description: '',
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'employer') {
            router.push('/jobs');
        } else {
            loadJobs();
        }
    }, [user, router]);

    const loadJobs = async () => {
        if (user?.id) {
            setIsLoading(true);
            try {
                const employerJobs = await getEmployerJobsAction(user.id);
                setJobs(employerJobs);
            } catch (error) {
                console.error('Failed to load jobs:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = (job: JobWithStatus) => {
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            category: job.category,
            description: job.description,
        });
        setEditingJobId(job.id);
        setIsCreating(true);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingJobId(null);
        setFormData({
            title: '',
            company: '',
            location: '',
            salary: '',
            category: CATEGORIES[1],
            description: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingJobId) {
                await updateJobAction(editingJobId, formData);
                alert('Вакансия обновлена и отправлена на модерацию.');
            } else {
                await createJobAction({
                    ...formData,
                    employerId: user!.id,
                });
                alert('Вакансия успешно создана! Она отправлена на модерацию.');
            }

            handleCancel();
            loadJobs();
        } catch (error) {
            alert('Ошибка при сохранении вакансии');
        }
    };

    if (!user || user.role !== 'employer') return null;

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Кабинет работодателя</h1>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)}>
                        Разместить вакансию
                    </Button>
                )}
            </div>

            {isCreating ? (
                <Card className={styles.card} padding="lg">
                    <h2 className={styles.cardTitle}>{editingJobId ? 'Редактирование вакансии' : 'Новая вакансия'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Название вакансии"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Input
                            label="Название компании"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                        <div className={styles.row}>
                            <Input
                                label="Локация"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <Input
                                label="Зарплата"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="например, 100k - 150k"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Категория</label>
                            <select
                                className={styles.select}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CATEGORIES.filter(c => c !== 'All').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Описание</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={6}
                                required
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button type="button" variant="outline" onClick={handleCancel}>Отмена</Button>
                            <Button type="submit">{editingJobId ? 'Сохранить изменения' : 'Опубликовать'}</Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <div className={styles.jobsList}>
                    {isLoading ? (
                        <p>Загрузка...</p>
                    ) : jobs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Card padding="lg" className={styles.emptyCard}>
                                <h3>Нет активных вакансий</h3>
                                <p>Вы еще не разместили ни одной вакансии. Нажмите кнопку выше, чтобы начать.</p>
                            </Card>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {jobs.map(job => (
                                <Card key={job.id} padding="lg">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{job.title}</h3>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: job.status === 'APPROVED' ? '#dcfce7' : job.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                                    color: job.status === 'APPROVED' ? '#166534' : job.status === 'REJECTED' ? '#991b1b' : '#854d0e'
                                                }}>
                                                    {job.status === 'APPROVED' ? 'Опубликовано' : job.status === 'REJECTED' ? 'Отклонено' : 'На модерации'}
                                                </span>
                                            </div>
                                            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>{job.company} • {job.location}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                                Размещено: {job.postedAt}
                                            </p>
                                        </div>
                                        <Button variant="outline" onClick={() => handleEdit(job)}>
                                            Редактировать
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
