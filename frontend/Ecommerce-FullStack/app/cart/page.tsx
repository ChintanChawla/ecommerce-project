'use client'
import React from 'react'
import Navbar from '../components/Navbar'
import AllCartProduct from '../components/AllCartProduct'
import { getUserFromToken } from '../utils/auth'


type Props = {}
type User = {
  id: number; // or string if the ID is a string
  // other properties
};

const Cart =  (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const user = getUserFromToken();

  if (!user) {
      // Handle the case where user is not logged in
      return <div>Please log in to view your cart.</div>;
  }

  const userId = user.id;

  const id = userId
   // const session = await getServerSession(options)
  return (
    <>
    <div className='max-w-[1280px] mx-auto px-5'>
        <Navbar/>
        <AllCartProduct userId = {id} />
        {/* <hr className='mt-10 mb-10' />
        <Allpurchased userId = {1} /> */}
    </div>
    </>
  )
}

export default Cart