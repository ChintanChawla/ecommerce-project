'use client'; // Indicate that this is a client-side component
import React, { useEffect, useState } from 'react';
import { AiOutlineHeart } from "react-icons/ai";
import Link from 'next/link';
import axios from 'axios'; // Use axios or fetch to get data from the API
import api from '@/app/utils/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  discount: string;
  category: string;
  seller_id: number;
};
const urlString ='https://ipfs.volaverse.com/ipfs/bafybeigbzezzrzg4pzxsb6cqeelz6nrv4yts4fmekdrjrm2ypw56lfbiae/dress_1.png';

const Item = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/list'); // Replace with your API endpoint
        setProducts(response.data); // Assuming API returns the product array directly
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div>Empty</div>
    );
  }

  return (
    <div>
      <h1 className='py-3 text-xl'>Clothing</h1>
      <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-20 gap-12'>
        {products.map((product) => (
          <div key={product.id}>
            <Link href={`/dashboard/${product.id}`}>
              <div className='relative rounded-lg'>
                {/* Uncomment and use actual image source */}
                <img src={urlString} className='w-[250px] h-[300px] object-cover object-top rounded-lg' alt={product.name} />
              </div>
              <div className='flex items-center justify-between mt-4'>
                <div>
                  <h1 className='text-[14px] font-medium max-w-[150px] whitespace-nowrap overflow-hidden'>{product.name}</h1>
                  <p className='text-[13px] opacity-60'>{product.category}</p>
                </div>
                <span className='px-2 font-medium bg-gray-100 rounded-lg'>${product.price}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Item;
