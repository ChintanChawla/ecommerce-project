'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from "axios"
import { isValidEmail } from '../utils/validation'

type Props = {}

const SignForm = (props: Props) => {
    const [user, setUser] = useState({
        name:"",
        email:"",
        password:"",
        role: "buyer" // Default to "buyer"
    })

    const router  = useRouter()
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setUser({ ...user, email });

        if (!isValidEmail(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError(null);
        }
    }

    const Register = () => {
        const data = {
            username: user.name,
            email: user.email,
            password:user.password,
            role: user.role
        }
        if (emailError) {
            console.log('Please correct the errors before submitting.');
            setError('Please enter a valid email id')
            return;
        }
        axios.post('http://localhost:3002/api/auth/register', data)
            .then((response) => {
                if (response.status === 200) { // Check if the response status is OK
                    const { token } = response.data; // Destructure the token from the response data
                    console.log('Signup successful:', token);
                    router.push('/signin'); // Redirect to the login page
                } else {
                    setError('Registration failed. Please try again.'); // Set an error message if the status is not OK
                }
            })
            .catch((error) => {
                console.log('Error:', error.response.data.msg);
                setError(error.response.data.msg); // Set a detailed error message
            });
    }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className='p-10 rounded-lg shadow-lg flex flex-col'>
            <h1 className='text-xl font-medium mb-4'>Sign Up</h1>
            <label htmlFor="" className='mb-2'>Name</label>
            <input 
            type="text"
            className='p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black'
            id='name'
            value={user.name}
            placeholder='name'
            onChange={(e) => setUser({...user, name: e.target.value})}
             />
            <label htmlFor="" className='mb-2'>Email</label>
            <input 
            type="text"
            className='p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black'
            id='email'
            value={user.email}
            placeholder='email'
            onChange={handleEmailChange}
             />
            <label htmlFor="" className='mb-2'>Password</label>
            <input 
            type="password"
            className='p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black'
            id='password'
            value={user.password}
            placeholder='password'
            onChange={(e) => setUser({...user, password: e.target.value})}
             />
                             <label htmlFor="role" className='mb-2'>Register as</label>
                <select
                    id="role"
                    value={user.role}
                    className="p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black"
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
             <button onClick={Register} className='p-2 border bg-purple-600 text-white border-gray-300 mt-2 mb-4 focus:outline-none focus:border-gray-600'>
                Register Now
             </button>
             {error && (
                    <p className='text-red-500 mb-4 mx-auto'>{error}</p> // Display error message if present
                )}
             <Link href='/signin' className='text-sm text-center mt-5 text-neutral-600'>Already have an Account?</Link>
             <Link href='/' className='text-center mt-2'>Home</Link>
        </div>
    </div>
  )
}

export default SignForm