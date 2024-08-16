'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

// import {signIn} from "next-auth/react" (if not using next-auth signIn function)

type Props = {}

const Signinform = (props: Props) => {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const Login = async () => {
        if (!validateEmail(user.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        try {
            const response = await api.post('/auth/login', {
                email: user.email,
                password: user.password,
            });
            console.log(response)
            console.log(response.status)

            if (response) {
                const data =  response.data;
                console.log('Login successful:', data);
                localStorage.setItem('jwt',data.token)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const decodedToken = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
                setUser(decodedToken.user); // Update the user state in useAuth context

                if (decodedToken.user.role === 'buyer') {
                    router.push('/');
                } else {
                    router.push('/myproducts');
                }
                
            } 
             else {
                
                setErrorMessage('An unexpected error occurred. Please try again.'); 
            }
        } catch (error) {
            console.error('Error while logging in:', error);
            setErrorMessage('An unexpected error occurred. Please try again.'); 
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <div className='p-10 rounded-lg shadow-lg flex flex-col'>
                <h1 className='text-xl font-medium mb-4'>Sign In</h1>
                <label htmlFor="email" className='mb-2'>Email</label>
                <input
                    type="email"
                    className='p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black'
                    id='email'
                    value={user.email}
                    placeholder='email'
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <label htmlFor="password" className='mb-2'>Password</label>
                <input
                    type="password"
                    className='p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black'
                    id='password'
                    value={user.password}
                    placeholder='password'
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <button onClick={Login} className='p-2 border bg-purple-600 text-white border-gray-300 mt-2 mb-4 focus:outline-none focus:border-gray-600'>
                    Login Now
                </button>
                {errorMessage && (
                    <p className='text-red-500 mb-4 mx-auto'>{errorMessage}</p> // Display error message if present
                )}
                <Link href='/signup' className='text-sm text-center mt-5 text-neutral-600'>Do not have an account</Link>
                <Link href='/' className='text-center mt-2'>Home</Link>
            </div>
        </div>
    )
}

export default Signinform;
