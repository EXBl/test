import React from 'react';
import Link from 'next/link';
import { Job } from '@/lib/mockData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import styles from './JobCard.module.css';

interface JobCardProps {
    job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className={styles.company}>{job.company}</p>
                </div>
                <span className={styles.salary}>{job.salary}</span>
            </div>

            <div className={styles.meta}>
                <span className={styles.tag}>{job.location}</span>
                <span className={styles.tag}>{job.category}</span>
                <span className={styles.date}>Posted {job.postedAt}</span>
            </div>

            <p className={styles.description}>{job.description}</p>

            <div className={styles.actions}>
                <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                </Link>
                <Button size="sm">Apply Now</Button>
            </div>
        </Card>
    );
};
