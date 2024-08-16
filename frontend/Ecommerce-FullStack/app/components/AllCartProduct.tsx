'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DeleteCart from './DeleteCart'
import api from '../utils/api'
import { getUserFromToken } from '../utils/auth'

type Props = {
    userId?: number
}

type CartProduct = {
    id: number;
    product_id: number;
    name: string;
    description: string;
    price: string;
    discount: string;
    quantity: number;
    total_price: number;
    image_url: string;
}

const AllCartProduct = (props: Props) => {
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([])
    const [totalCartPrice, setTotalCartPrice] = useState<string>('')
    const jwtToken = localStorage.getItem('jwt')
    const user = getUserFromToken();

    useEffect(() => {
        const fetchCartProducts = async () => {
            if (!jwtToken) {
                console.error('No JWT token found in localStorage')
                return
            }

            try {
                const response = await api.get('/cart/getCart', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    params: {
                        userId: props.userId,
                    },
                })

                const { cartItems, totalCartPrice } = response.data;

                setCartProducts(cartItems)
                setTotalCartPrice(totalCartPrice)
            } catch (error) {
                console.error('Error fetching cart products:', error)
            }
        }

        fetchCartProducts()
    }, [props.userId])

    const allIds = cartProducts.map((item) => item.id)

    const removeProduct = (productId: number) => {
        setCartProducts((prevCartProducts) =>
            prevCartProducts.filter((product) => product.id !== productId)
        );
    };

    const handleProductDelete = (productId: number) => {
        setCartProducts((prevCartProducts) => prevCartProducts.filter(product => product.id !== productId));
    };

    const updateCartProduct = async (productId: number, newQuantity: number, action: 'add' | 'remove') => {
        if (!jwtToken) {
            console.error('No JWT token found in localStorage')
            return
        }
        const apiUrl = action === 'add'
            ? '/cart/addInCart'
            : '/cart/removeFromCart';

        try {
            const response = await api.post(
                apiUrl,
                {
                    product_id: productId,
                    quantity: newQuantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    }
                }
            )

            const updatedCartProduct = response.data;

            if (response.data.quantity === 0) {
                removeProduct(productId);
                return
            }

            setCartProducts((prevCartProducts) =>
                prevCartProducts.map((product) =>
                    product.id === updatedCartProduct.id
                        ? {
                            ...product,
                            quantity: updatedCartProduct.quantity,
                            total_price: updatedCartProduct.total_price,
                        }
                        : product
                )
            )

            setTotalCartPrice(updatedCartProduct.totalCartPrice);
        } catch (error) {
            console.error('Error updating cart product:', error)
        }
    }

    const handleIncrement = (productId: number) => {
        updateCartProduct(productId, 1, 'add')
    }

    const handleDecrement = (productId: number) => {
        updateCartProduct(productId, 1, 'remove')
    }

    if (cartProducts.length === 0) {
        return (
            <div className='relative flex items-center justify-center'>
                <img src="empty.png" alt="Empty Cart" />
                <h1 className='absolute top-[80%] text-2xl text-purple-600'>Empty Cart</h1>
            </div>
        )
    }

    return (
        <div className="mt-14">
            {cartProducts.map((cartProduct) => (
                <div key={cartProduct.id} className="flex items-center justify-between w-8/12 mx-auto shadow-lg p-5 rounded-lg mt-6">
                    <div>
                        <h1 className="text-2xl mb-3">{cartProduct.name}</h1>
                        <h2 className="mb-2 text-neutral-800">Price: {cartProduct.price}</h2>
                        <h3 className="text-sm text-neutral-600 mb-2">Discount: {cartProduct.discount}</h3>
                        <h3 className="text-sm text-neutral-600 mb-2">Quantity</h3>
                        <div className="flex items-center">
                            <button
                                onClick={() => handleDecrement(cartProduct.product_id)}
                                className="bg-gray-200 px-2 py-1 rounded"
                                disabled={cartProduct.quantity === 1} // Disable button if quantity is 1
                            >
                                -
                            </button>
                            <span className="mx-2">{cartProduct.quantity}</span>
                            <button
                                onClick={() => handleIncrement(cartProduct.product_id)}
                                className="bg-gray-200 px-2 py-1 rounded"
                            >
                                +
                            </button>
                        </div>
                        <h2 className="mb-2 text-neutral-800">Total Price: {cartProduct.total_price}</h2>
                        <DeleteCart productId={cartProduct.product_id} quantity={cartProduct.quantity} onDelete={handleProductDelete} />
                    </div>
                    <Link href={`/dashboard/${cartProduct.id}`}>
                        <div>
                            <img src={cartProduct.image_url} className='w-[200px] h-[200px] object-cover object-top' alt={cartProduct.name} />
                        </div>
                    </Link>
                </div>
            ))}
            <div className="w-8/12 mx-auto mt-8 p-5 rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl text-right">Total Cart Price: {totalCartPrice}</h2>
            </div>
        </div>
    )
}

export default AllCartProduct
