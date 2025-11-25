'use server';

import { db, JobWithStatus } from '../db';
import { Job } from '../mockData';

export async function getJobsAction() {
    const jobs = await db.getJobs();
    // Only return APPROVED jobs to public feed
    return jobs.filter(job => job.status === 'APPROVED');
}

export async function createJobAction(jobData: Omit<Job, 'id' | 'postedAt' | 'status'>) {
    const newJob: JobWithStatus = {
        ...jobData,
        id: Math.random().toString(36).substr(2, 9),
        postedAt: new Date().toISOString().split('T')[0],
        status: 'PENDING', // Default to PENDING
    };

    await db.createJob(newJob);
    return { success: true, job: newJob };
}

export async function getEmployerJobsAction(employerId: string) {
    const jobs = await db.getJobs();
    return jobs.filter(job => job.employerId === employerId);
}

export async function updateJobAction(jobId: string, data: Partial<Job>) {
    const jobs = await db.getJobs();
    const job = jobs.find(j => j.id === jobId);

    if (job) {
        const updatedJob: JobWithStatus = {
            ...job,
            ...data,
            status: 'PENDING'
        };
        await db.updateJob(updatedJob);
        return { success: true };
    }
    return { success: false, error: 'Job not found' };
}

export async function getJobByIdAction(id: string) {
    const jobs = await db.getJobs();
    return jobs.find(job => job.id === id);
}
