'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJobByIdAction } from '@/lib/actions/jobs';
import { Job } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import styles from './job-details.module.css';

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (params.id) {
                try {
                    const data = await getJobByIdAction(params.id as string);
                    setJob(data || null);
                } catch (error) {
                    console.error('Failed to fetch job:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchJob();
    }, [params.id]);

    if (isLoading) return <div className="container" style={{ padding: '2rem' }}>Загрузка...</div>;

    if (!job) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1>Вакансия не найдена</h1>
                <Button onClick={() => router.push('/jobs')}>Назад к вакансиям</Button>
            </div>
        );
    }

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setIsApplied(true);
        setIsApplyModalOpen(false);
        alert('Ваш отклик отправлен!');
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.content}>
                <Card className={styles.header} padding="lg">
                    <div className={styles.titleRow}>
                        <div>
                            <h1 className={styles.title}>{job.title}</h1>
                            <p className={styles.company}>{job.company} • {job.location}</p>
                        </div>
                        <div className={styles.salary}>{job.salary}</div>
                    </div>

                    <div className={styles.meta}>
                        <span className={styles.tag}>{job.category}</span>
                        <span className={styles.date}>Опубликовано: {job.postedAt}</span>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => setIsApplyModalOpen(true)}
                        disabled={isApplied}
                    >
                        {isApplied ? 'Вы откликнулись' : 'Откликнуться'}
                    </Button>
                </Card>

                <Card className={styles.description} padding="lg">
                    <h2 className={styles.sectionTitle}>Описание</h2>
                    <p className={styles.text}>{job.description}</p>

                    <h3 className={styles.sectionTitle}>Требования</h3>
                    <ul className={styles.list}>
                        <li>Опыт работы от 1 года</li>
                        <li>Ответственность и пунктуальность</li>
                        <li>Желание работать и развиваться</li>
                    </ul>
                </Card>
            </div>

            <Modal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                title={`Отклик на вакансию ${job.title}`}
            >
                <form onSubmit={handleApply} className={styles.form}>
                    <Input label="Сопроводительное письмо" placeholder="Почему вы подходите на эту роль?" />
                    <Input label="Ссылка на портфолио/резюме" placeholder="https://..." />
                    <div className={styles.modalActions}>
                        <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>Отмена</Button>
                        <Button type="submit">Отправить</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
