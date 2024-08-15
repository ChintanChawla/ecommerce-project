'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {CiShoppingCart,CiCreditCard1} from "react-icons/ci"
import { useAuth } from '../utils/auth'; 
import api from '../utils/api';
type Props = {
    productId?:number
}

const AddCart = ({productId}: Props) => {

    const user = useAuth(); 
    const token = localStorage.getItem('jwt')


    const id = 1
    const router = useRouter()

    const handleCart =  async() => {
        if(user){
        try{
            const response = await api.post('/cart/addInCart',{
                product_id:productId,
                quantity:1
            },                {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token in the Authorization header
                },
            })
            .then((response)=> {
                router.push('/cart')
                console.log(response.data)
            })
        }catch(error){
            console.log(error)
        }
    }else{
        router.push('/signin')
    }
    }
        return(
            <div onClick={handleCart} className='flex items-center space-x-4 bg-purple-600 text-white px-6 p-2 rounded-full cursor-pointer'>
                <span>
                    <CiShoppingCart size={24} />
                </span>
                <span className='text-wm'>Add to Cart</span>
            </div>
        )
}

export default AddCart