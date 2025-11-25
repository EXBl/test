
'use server';

import { db } from '../db';

export async function getPendingJobsAction() {
    const jobs = await db.getJobs();
    return jobs.filter(job => job.status === 'PENDING');
}

export async function approveJobAction(jobId: string) {
    await db.updateJobStatus(jobId, 'APPROVED');
    return { success: true };
}

export async function rejectJobAction(jobId: string) {
    await db.updateJobStatus(jobId, 'REJECTED');
    return { success: true };
}

export async function getAllUsersAction() {
    return await db.getUsers();
}

export async function getAdminStatsAction() {
    const jobs = await db.getJobs();
    const users = await db.getUsers();

    return {
        pendingJobs: jobs.filter(j => j.status === 'PENDING').length,
        totalUsers: users.length,
    };
}
