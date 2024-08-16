type User = {
    id: number;
    username: string;
    role: string;
};

export const getUserFromToken = (): User | null => {
    if (typeof window === 'undefined') {
        // If we're on the server, return null
        return null;
    }
    const token = localStorage.getItem('jwt');
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.user as User; // Assuming the user object is stored in the token payload
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    } else {
        return null;
    }
};
