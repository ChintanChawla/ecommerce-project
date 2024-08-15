import React from 'react'
import { getServerSession } from 'next-auth'
import {options} from "@/app/api/auth/[...nextauth]/options"
import Navbar from '../components/Navbar'
import AllCartProduct from '../components/AllCartProduct'
import Allpurchased from '../components/Allpurchased'
import { useAuth } from '../utils/auth'


type Props = {}

const Cart = async (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
   const user = useAuth(); 
   // const session = await getServerSession(options)
  return (
    <>
    <div className='max-w-[1280px] mx-auto px-5'>
        <Navbar/>
        <AllCartProduct userId = {1} />
        {/* <hr className='mt-10 mb-10' />
        <Allpurchased userId = {1} /> */}
    </div>
    </>
  )
}

export default Cart