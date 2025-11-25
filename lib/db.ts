import fs from 'fs/promises';
import path from 'path';
import { User, Job } from './mockData';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface DatabaseSchema {
    users: User[];
    jobs: Job[];
}

// Extend Job type to include status
export interface JobWithStatus extends Job {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class JsonDB {
    private async readDB(): Promise<DatabaseSchema> {
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, return empty structure
            return { users: [], jobs: [] };
        }
    }

    private async writeDB(data: DatabaseSchema): Promise<void> {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }

    async getUsers(): Promise<User[]> {
        const db = await this.readDB();
        return db.users;
    }

    async createUser(user: User): Promise<User> {
        const db = await this.readDB();
        db.users.push(user);
        await this.writeDB(db);
        return user;
    }

    async updateUser(user: User): Promise<void> {
        const db = await this.readDB();
        const userIndex = db.users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            db.users[userIndex] = user;
            await this.writeDB(db);
        }
    }

    async getJobs(): Promise<JobWithStatus[]> {
        const db = await this.readDB();
        return db.jobs as JobWithStatus[];
    }

    async createJob(job: JobWithStatus): Promise<JobWithStatus> {
        const db = await this.readDB();
        db.jobs.push(job);
        await this.writeDB(db);
        return job;
    }

    async updateJobStatus(jobId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
        const db = await this.readDB();
        const jobIndex = db.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
            (db.jobs[jobIndex] as JobWithStatus).status = status;
            await this.writeDB(db);
        }
    }

    async updateJob(job: JobWithStatus): Promise<void> {
        const db = await this.readDB();
        const jobIndex = db.jobs.findIndex(j => j.id === job.id);
        if (jobIndex !== -1) {
            db.jobs[jobIndex] = job;
            await this.writeDB(db);
        }
    }
}

export const db = new JsonDB();
