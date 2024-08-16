'use client'; // Indicates this is a client-side component
import React, { useEffect, useState } from 'react';
import { AiTwotoneEdit } from "react-icons/ai";
import axios from 'axios';
import Navbar from '../components/Navbar';
import DeleteProduct from '../components/DeleteProduct';
import api from '../utils/api';
import Link from 'next/link';
import { getUserFromToken } from '../utils/auth';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  discount: string;
  category: string;
  seller_id: number;
  image_url:string
};

const MyProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // State to track the product being edited
  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    setIsClient(true); // Set to true when the component has mounted on the client
  }, []);

  useEffect(() => {
    if (isClient) {
      const user = getUserFromToken();
      console.log(user);
      if (user) {
        if (user.role !== 'seller') {
          window.location.href = '/';
        }
      } else {
        window.location.href = '/signin';
      }
    }
  }, [isClient]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          return;
        }

        const response = await api.get('/products/listSellerProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data); // Assuming the API response directly provides the product array
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product); // Set the product being edited
  };
  const handleProductDelete = (productId: number) => {
    setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await api.put(`/products/edit/${editingProduct.id}`, editingProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle successful update (e.g., show a message, refresh the product list)
      console.log('Product updated successfully:', response.data);
      setEditingProduct(null); // Reset editing state
      // Optionally, refresh the product list to show updated data
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);

    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className='relative flex items-center justify-center'>
        <img src="empty.png" alt="Empty" />
        <div className='absolute top-[80%] flex flex-col items-center'>
    <h1 className='text-2xl text-purple-600'>No product added</h1>
    <Link href="/addproduct">
      <button className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'>
        Add Product
      </button>
    </Link>
  </div>
      </div>
    );
  }

  return (
    <div className='max-w-[1280px] mx-auto'>
      <Navbar />
      <div>
        {products.map((product) => (
          <div key={product.id} className='relative flex items-center justify-between w-8/12 px-6 mx-auto shadow-lg shadow-purple-100 p-5 rounded-lg mt-10'>
            <div>
              {editingProduct?.id === product.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Product Name"
                  />
                  <input
                    type="text"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Product Price"
                  />
                  <textarea
                    name="description"
                    value={editingProduct.description}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Product Description"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editingProduct.category}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Product Category"
                  />
                  <input
                    type="text"
                    name="discount"
                    value={editingProduct.discount}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Product Discount"
                  />
                  <input
                    type="text"
                    name="image_url"
                    value={editingProduct.image_url}
                    onChange={handleInputChange}
                    className='mb-3 p-2 border rounded w-full'
                    placeholder="Image Url"
                  />
                  <button onClick={handleUpdateProduct} className='px-4 py-2 bg-green-600 text-white rounded'>
                    Save
                  </button>
                  <button onClick={() => setEditingProduct(null)} className='ml-2 px-4 py-2 bg-red-600 text-white rounded'>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <div>
                  <h1 className='mb-3'> Name:  {product.name}</h1>
                  <h1 className='mb-3'> Price: {product.price}</h1>
                  <h1 className='mb-3'> Category: {product.category}</h1>
                  <h1 className='mb-3'> Discount: {product.discount}</h1>
                  <DeleteProduct productId={product.id!}  onDelete={handleProductDelete}/>
                  </div>

                </div>

                
              )}
            </div>
            {editingProduct?.id != product.id ? (
                  <div>
                    <img className='w-[200px] h-[200px] object-cover object-top' src={product.image_url} alt={product.name} />
                  </div>
            ):(<div></div>)}
            {

                <button onClick={() => handleEditClick(product)} className='absolute top-0 right-0 p-2 bg-green-600 rounded-full text-white cursor-pointer'>
                  <AiTwotoneEdit size={18} />
                </button>

            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProductsPage;
