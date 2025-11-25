export type UserRole = 'executor' | 'employer' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    avatar?: string;
    companyName?: string; // Only for employers
    skills?: string[]; // Only for executors
    bio?: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    category: string;
    postedAt: string;
    employerId: string;
}

export const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'executor',
        skills: ['React', 'TypeScript', 'Node.js'],
        bio: 'Frontend developer with 5 years of experience.',
    },
    {
        id: '2',
        name: 'Tech Corp',
        email: 'hr@techcorp.com',
        role: 'employer',
        companyName: 'Tech Corp Inc.',
    },
];

export const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Corp Inc.',
        location: 'Remote',
        salary: '150,000 - 200,000 RUB',
        description: 'We are looking for a Senior Frontend Developer to join our team...',
        category: 'IT',
        postedAt: '2023-10-25',
        employerId: '2',
    },
    {
        id: '2',
        title: 'UX Designer',
        company: 'Design Studio',
        location: 'Moscow',
        salary: '100,000 - 150,000 RUB',
        description: 'Creative UX Designer needed for mobile app projects...',
        category: 'Design',
        postedAt: '2023-10-24',
        employerId: '3',
    },
    {
        id: '3',
        title: 'Courier',
        company: 'Fast Delivery',
        location: 'Saint Petersburg',
        salary: '50,000 - 80,000 RUB',
        description: 'Fast delivery service needs reliable couriers...',
        category: 'Logistics',
        postedAt: '2023-10-26',
        employerId: '4',
    },
];

export const CATEGORIES = ['All', 'IT', 'Design', 'Sales', 'Logistics', 'Construction'];
