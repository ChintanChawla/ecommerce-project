'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {CiShoppingCart,CiCreditCard1} from "react-icons/ci"

import api from '../utils/api';
import { getUserFromToken } from '../utils/auth'
type Props = {
    productId?:number
}

const AddCart = ({productId}: Props) => {


    const user = getUserFromToken();
    const token = localStorage.getItem('jwt')


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