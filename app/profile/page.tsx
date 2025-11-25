'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import styles from './profile.module.css';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '',
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setFormData({
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            skills: user.skills?.join(', ') || '',
        });
    }, [user, router]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would update the user via API
        setIsEditing(false);
        alert('Profile updated! (Mock)');
    };

    if (!user) return null;

    return (
        <div className={`container ${styles.container}`}>
            <Card className={styles.card} padding="lg">
                <div className={styles.header}>
                    <h1 className={styles.title}>My Profile</h1>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave} className={styles.form}>
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Email"
                            value={formData.email}
                            disabled
                            className={styles.disabledInput}
                        />
                        <div className={styles.field}>
                            <label className={styles.label}>Bio</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <Input
                            label="Skills (comma separated)"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                        <div className={styles.actions}>
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.view}>
                        <div className={styles.infoGroup}>
                            <label className={styles.label}>Full Name</label>
                            <p className={styles.value}>{formData.name}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <label className={styles.label}>Email</label>
                            <p className={styles.value}>{formData.email}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <label className={styles.label}>Bio</label>
                            <p className={styles.value}>{formData.bio || 'No bio provided.'}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <label className={styles.label}>Skills</label>
                            <div className={styles.skills}>
                                {formData.skills ? (
                                    formData.skills.split(',').map((skill, i) => (
                                        <span key={i} className={styles.skillTag}>{skill.trim()}</span>
                                    ))
                                ) : (
                                    <p className={styles.value}>No skills listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
