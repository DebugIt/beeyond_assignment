import InfoContext from '@/context/InfoContext'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { placeorder } from './api/products'

const cart = () => {
  
    const { cart, setCart } = useContext(InfoContext)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const createOrder = async () => {
        setLoading(true);
        try {
            const response = await placeorder({ items: cart})
            if(response.status){
                console.log(response)
                localStorage.setItem('cart', [])
                setCart([])
                toast.success(response?.message || "Order Placed!")
                router.push("/dashboard")
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error Logging In");
            console.log("error......", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn")
      if(!isLoggedIn){
        router.push("/")
      }
    }, [])
    

    return (
        <div id='container' className='p-3 space-y-2'>
            <h2 className='text-2xl font-bold'>Order Summary</h2>
                <hr className='my-3'/>

                {
                    cart.length === 0 && (
                        "No Products in Cart"
                    )
                }
                {
                    cart.map((item, index) => (
                        <>
                            <div id="cart-item" key={index} className='flex items-start gap-2'>
                                <div id="img">
                                    <Image 
                                        src={item?.image}
                                        height={50}
                                        width={50}
                                        alt={item.name}
                                        className='bg-gray-100 rounded-md w-16 h-16'
                                    />
                                </div>
                                <div id="info">
                                    <p className='font-bold text-lg'>
                                        {item?.name}
                                    </p>
                                    <p className='text-sm'>
                                        ₹ {item.price} X {item.qty} = ₹{item.price * item.qty}
                                    </p>
                                </div>
                            </div>
                            <hr className='border-black/10'/>
                        </>
                    ))
                }
                <p className='text-sm font-semibold'>Total {cart.length} products</p>
                
                <hr className='my-3'/>
                
                <div className='flex items-center justify-between'>
                    <p id="subtotal" className='font-bold text-xl'>
                        Subtotal:  ₹ {cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
                    </p>
                    <button onClick={() => {createOrder()}} className='px-3 py-1 rounded-md bg-black text-white hover:font-bold hover:shadow-md cursor-pointer hover:scale-105 transition-all'>
                        Place Order
                    </button>
                </div>
                {/* checkout */}
        </div>
    )
}

export default cart