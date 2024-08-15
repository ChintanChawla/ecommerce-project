import axios from 'axios';
import router from 'next/router'; // or import your routing module

// Create an instance of axios

console.log()
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Set your base URL
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Return the response if it's successful
        console.log('here in the response')
        return response;
    },
    (error) => {
        // Check if the error is 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.log('here in the error')
            // Clear any stored tokens or user data
            localStorage.removeItem('token'); // Assuming you're storing the token in localStorage
            // Redirect to the sign-in page
            window.location.href = '/signin';
        }
        // Return the error to be handled by the request
        return Promise.reject(error);
    }
);

export default api;
