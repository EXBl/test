'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CATEGORIES } from '@/lib/mockData';
import styles from './JobFilters.module.css';

interface JobFiltersProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <Card className={styles.filters} padding="md">
            <h3 className={styles.title}>Filters</h3>

            <div className={styles.section}>
                <Input
                    placeholder="Search keywords..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className={styles.section}>
                <h4 className={styles.subtitle}>Category</h4>
                <div className={styles.categories}>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            className={`${styles.category} ${selectedCategory === category ? styles.active : ''}`}
                            onClick={() => onSelectCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <Button variant="outline" className={styles.resetButton} onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
            }}>
                Reset Filters
            </Button>
        </Card>
    );
};
