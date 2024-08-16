'use client'
import React from 'react'
import axios from 'axios'
import {GoTrash} from "react-icons/go"
import { useRouter } from 'next/navigation'
import api from '../utils/api'

type Props = {
    productId:number
    quantity?:number
    onDelete: (productId: number) => void
}

const DeleteCart = (props: Props) => {
    const router = useRouter()
    const token = localStorage.getItem('jwt')
    const handleDelete = async () => {
        try{

    const response = await api.post('/cart/removeFromCart',{
    product_id: props.productId,
    quantity:props.quantity
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
    }
  return (
    <div className='cursor-pointer' onClick={handleDelete}>
        <GoTrash className='text-red-500' size={20}/>
    </div>
  )
}

export default DeleteCart