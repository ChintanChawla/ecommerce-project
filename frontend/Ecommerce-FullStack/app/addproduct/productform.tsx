'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Productform = () => {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwt')
        if (jwtToken) {
            setToken(jwtToken)
            const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]))
            if (decodedToken.user.role !== 'seller') {
                router.push('/')
            }
        } else {
            router.push('/')
        }
    }, [router])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        image_url: '',
        category: '', 
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value)
        setFormData({
            ...formData,
            [e.target.name]: value,
        })
    }

    const validateForm = () => {
        if (!formData.name || !formData.description || !formData.image_url || !formData.category || formData.price <= 0 || formData.discount < 0 || formData.discount > 100) {
            setError('Please fill in all fields correctly. Note: Discount must be between 0 and 100')
            return false
        }
        setError('')
        return true
    }

    const postData = async () => {
        if (!validateForm()) return

        try {
            if (token) {
                const response = await api.post('/products/create', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                router.push('/')
                console.log(response)
            } else {
                console.log('No token available')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='px-5 max-w-[1280px] mx-auto mb-10'>
            <Navbar />
            <h1 className='text-3xl font-semibold py-6'>Add your Product</h1>
            <div className='text-black mt-4'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                    <div>
                        <label htmlFor="name" className='font-medium'>Name</label>
                        <input 
                            type="text"
                            className='w-full h-[50px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className='font-medium'>Price</label>
                        <input 
                            type="number"
                            className='w-full h-[50px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='price'
                            value={formData.price}
                            onChange={handlePriceChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="discount" className='font-medium'>Discount</label>
                        <input 
                            type="number"
                            className='w-full h-[50px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='discount'
                            value={formData.discount}
                            onChange={handlePriceChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="image_url" className='font-medium'>Image URL</label>
                        <input 
                            type="text"
                            className='w-full h-[50px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='image_url'
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className='font-medium'>Category</label>
                        <input 
                            type="text"
                            className='w-full h-[50px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className='font-medium'>Description</label>
                        <textarea 
                            className='w-full h-[150px] border-[1px] rounded-lg focus:border-pink-500 px-3 focus:border-2 outline-none'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                <button onClick={postData} className='text-white mt-10 border-[1px] bg-purple-500 rounded-lg px-5 p-2'>Submit</button>
            </div>
        </div>
    )
}

export default Productform
