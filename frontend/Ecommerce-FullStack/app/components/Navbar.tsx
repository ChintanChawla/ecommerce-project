'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiShoppingCart } from "react-icons/ci";
import { BsChevronCompactUp } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import SearchBar from './SearchBar';

const Navbar = () => {
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [showNav, setShowNav] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null); // State to store user data

    useEffect(() => {
        const token = localStorage.getItem('jwt'); // Get JWT from localStorage
        if (token) {
            // Decode JWT or fetch user info from API
            // For simplicity, we'll just decode the JWT payload to get user info
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            setUser(decodedToken.user);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('jwt'); // Remove JWT from localStorage
        setUser(null);
        window.location.href = '/signin'; // Redirect to signin page
    };

    const SignOut = () => {
        if (user) {
            return (
                <ul className='py-5 px-1 text-neutral-600'>
                    <li className='hover:bg-gray-100 hover:text-neutral-900 px-5 py-2 cursor-pointer'>{user.name}</li>
                    <li onClick={handleSignOut} className='whitespace-nowrap hover:text-red-600 px-5 py-2 cursor-pointer'>SignOut</li>
                    <li className='whitespace-nowrap hover:bg-gray-100 hover:text-neutral-900 px-5 py-2 cursor-pointer'><a href="/addproduct">Add Product</a></li>
                </ul>
            );
        }
        return (
            <ul>
                <li onClick={() => window.location.href = '/signin'} className='whitespace-nowrap hover:bg-gray-100 hover:text-neutral-900 px-5 py-2 cursor-pointer'>SignIn</li>
            </ul>
        );
    };

    return (
        <div>
            <div className='flex items-center justify-between py-4 relative'>
                <div className='flex items-center md:space-x-10 lg:space-x-20'>
                    <div className='font-semibold text-2xl'><a href="/">SEINE</a></div>
                    <nav className='max-md:hidden'>
                        <ul className='flex items-center lg:space-x-10 space-x-7 opacity-70 text-[15px]'>
                            <li><a href="/" className='py-3 inline-block w-full'>Shop</a></li>
                            <li><a href="filters" className='py-3 inline-block w-full'>Filters</a></li>
                            {user && (
                                <li><a href="myproducts" className='py-3 inline-block w-full'>My Products</a></li>
                            )}
                        </ul>
                    </nav>
                </div>
                <div className='flex items-center space-x-4'>
                    <SearchBar />
                    <div onClick={() => setShowProfile(!showProfile)} className='relative cursor-pointer'>
                        <img src="userPhoto1.jpg" className='w-[35px] h-[35px] rounded-full object-cover' alt="" />
                        <div className={`absolute bg-white z-[2] rounded-lg shadow-lg ${showProfile ? "" : "hidden"}`}>
                            <SignOut />
                        </div>
                    </div>
                    {user ? (
                        <Link href='/cart'>
                            <div className='p-2 bg-gray-100 rounded-full'><CiShoppingCart size={20} /></div>
                        </Link>
                    ) : (
                        <Link href='/signin'>
                            <div className='p-2 bg-gray-100 rounded-full'><CiShoppingCart size={20} /></div>
                        </Link>
                    )}
                    <span onClick={() => setShowNav(!showNav)} className='p-[9px] bg-gray-100 rounded-full md:hidden'>
                        <BsChevronCompactUp className={`transition ease-in duration-150 ${showNav ? "rotate-180" : "0"}`} />
                    </span>
                </div>
            </div>
            <div className={`md:hidden ${showNav ? "pb-4 px-5" : "h-0 invisible opacity-0"}`}>
                <ul className='flex flex-col text-[15px] opacity-75 px-2'>
                    <li><a href="/shop" className='py-3 inline-block w-full '>Shop</a></li>
                    <li><a href="/filters" className='py-3 inline-block w-full '>Filters</a></li>
                    {user && (
                        <li><a href="/myproducts" className='py-3 inline-block w-full '>My Product</a></li>
                    )}
                </ul>
                <div className='flex items-center bg-gray-100 p-2 rounded-lg my-4 py-3'>
                    <input
                        type="text"
                        className='outline-none w-full bg-transparent ml-2 caret-blue-500 placeholder:font-light placeholder:text-gray-600 text-[15px]'
                        placeholder='Search'
                        autoComplete='false'
                    />
                    <button><BiSearch size={20} className='opacity-50' /></button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
