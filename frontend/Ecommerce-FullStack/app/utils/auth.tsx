// hooks/useAuth.js
'use client'

import { useState, useEffect } from 'react';

type User = {
    id: number;
    username: string;
    role: string;
};

export const useAuth = (): User | null => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt'); // Get JWT from localStorage
        if (token) {
            try {
                // Decode JWT payload
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUser(decodedToken.user as User);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    return user;
};
