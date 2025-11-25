
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

export async function updateUserPasswordAction(userId: string, newPassword: string) {
    const users = await db.getUsers();
    const user = users.find(u => u.id === userId);

    if (user) {
        user.password = newPassword;
        await db.updateUser(user);
        return { success: true };
    }

    return { success: false, error: 'User not found' };
}
