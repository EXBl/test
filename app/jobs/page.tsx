'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Job } from '@/lib/mockData';
import { getJobsAction } from '@/lib/actions/jobs';
import { JobCard } from '@/components/features/JobCard';
import { JobFilters } from '@/components/features/JobFilters';
import styles from './jobs.module.css';

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobsAction();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [jobs, selectedCategory, searchQuery]);

    return (
        <div className={`container ${styles.container}`}>
            <aside className={styles.sidebar}>
                <JobFilters
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </aside>

            <main className={styles.feed}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Лента вакансий</h1>
                    <span className={styles.count}>Найдено: {filteredJobs.length}</span>
                </div>

                {isLoading ? (
                    <p>Загрузка вакансий...</p>
                ) : (
                    <div className={styles.list}>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className={styles.empty}>
                                <p>Вакансии не найдены.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
