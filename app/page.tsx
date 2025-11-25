import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MOCK_JOBS } from '@/lib/mockData';
import { JobCard } from '@/components/features/JobCard';
import styles from './page.module.css';

export default function Home() {
    const featuredJobs = MOCK_JOBS.slice(0, 3);

    return (
        <div className={`container ${styles.container}`}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Найдите работу мечты сегодня</h1>
                <p className={styles.subtitle}>
                    Свяжитесь с лучшими работодателями и найдите возможности, соответствующие вашим навыкам.
                </p>
                <div className={styles.actions}>
                    <Link href="/jobs">
                        <Button size="lg">Смотреть вакансии</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline" size="lg">Создать аккаунт</Button>
                    </Link>
                </div>
            </section>

            <section className={styles.featured}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Популярные вакансии</h2>
                    <Link href="/jobs" className={styles.viewAll}>Все вакансии →</Link>
                </div>
                <div className={styles.grid}>
                    {featuredJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <Card className={styles.ctaCard} padding="lg">
                    <div className={styles.ctaContent}>
                        <h2>Для работодателей</h2>
                        <p>Размещайте вакансии и находите лучших талантов для вашей компании.</p>
                        <Link href="/register">
                            <Button variant="secondary">Разместить вакансию</Button>
                        </Link>
                    </div>
                </Card>
            </section>
        </div>
    );
}
