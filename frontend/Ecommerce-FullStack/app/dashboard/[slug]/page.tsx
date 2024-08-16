import React from 'react'
import ImageGallery from '../ImageGallery'
import Info from '../Info'
import Review from '@/app/components/Review'
import ReviewSection from '../ReviewSection'
import api from '@/app/utils/api'

type Props = {}

export default async function Page({ params }: { params: { slug: string } }) {
    const productId = parseInt(params.slug, 10)

    console.log(productId)
    
let product;
    try {

        const response = await api.get(`/products/getProduct/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
         product = response.data.data[0]; // 
    } catch (error) {
        console.error('Error fetching product details:', error);
        return <div>Error fetching product details</div>;
    }

    // Fetch reviews from another API endpoint if necessary


    const allReview: any[] =  [];
    let averageRating = 0;

    if (allReview.length > 0) {
        const totalRating = allReview.reduce((acc: number, review: any) => {
            return acc + review.rating;
        }, 0);
        averageRating = totalRating / allReview.length;
    }

    
    return (
        <div className='max-w-[1280px] mx-auto px-5 py-5'>
            <div className='font-semibold text-2xl mb-2'>
                <a href="/">SEINE</a>
            </div>
            <hr />
            {product && (
                <div className='grid grid-cols-2 mt-10 gap-14'>
                    {product.image_url && (
                        <ImageGallery imageUrls={product.image_url} />
                    )}
                    <Info {...product} rating={averageRating} numbercomments={allReview.length} />
                </div>
            )}
            <div className='mb-20 mt-20'>
                <div className='flex items-center space-x-5 mb-10'>
                    <span className='w-[5px] h-[30px] bg-purple-600 rounded-full inline-block'></span>
                    <span className='font-medium text-xl'>Product Description</span>
                </div>
                {product && (
                    <div className='grid grid-cols-2'>
                        <div className='flex flex-col justify-center'>
                            <div className='grid grid-cols-3 gap-5 mb-5'>
                                <div>
                                    <h3 className='font-medium'>Category</h3>
                                    <p className='text-sm text-purple-500'>{product.category}</p>
                                </div>

                            </div>
                            <div style={{ borderColor: `${product.color?.split(',').pop()}` }} className={`leading-6 text-sm text-neutral-700 h-[200px] border-[1px] rounded-md p-4 overflow-scroll`} dangerouslySetInnerHTML={{ __html: product?.description }}></div>
                        </div>
                        {/* <div className='flex justify-end relative items-center'>
                            <img src={product.images.split(',').pop()} className='max-h-[300px] w-10/12 rounded-lg object-cover' alt="" />
                            <span className='text-sm absolute bottom-2 right-2 text-white font-medium'>{product.title}</span>
                        </div> */}
                    </div>
                )}
            </div>


        </div>
    )
}
