'use client'
import React from 'react'
import axios from 'axios'
import { GoTrash } from 'react-icons/go'
import { useRouter } from 'next/navigation'
import api from '../utils/api'

type Props = {
    productId:number,
    onDelete: (productId: number) => void
}

const DeleteProduct = ({productId,onDelete }: Props) => {
    const router = useRouter()

    const token = localStorage.getItem('jwt')
    const handleDelete = async () => {
        try{
            await api.delete(`/products/delete/${productId}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token in the Authorization header
                },
            })
            onDelete(productId)
            router.refresh()
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div onClick={handleDelete} className='cursor-pointer'>
        <GoTrash className='text-red-600' size={20}/>
    </div>
  )
}

export default DeleteProduct
