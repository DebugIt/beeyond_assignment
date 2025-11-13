import InfoContext from '@/context/InfoContext'
import Image from 'next/image'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'

const ProductCard = ({ item }) => {

    const { cart, setCart } = useContext(InfoContext)

    const addToCart = () => {
        const findInCart = cart.find(prod => prod?._id === item?._id)
        
        if(findInCart){
            const updateCart = cart.map((prd) => 
                prd._id === item._id ? { ...prd, qty: prd.qty + 1 } : prd
            )
            setCart(updateCart)
        }
        else{
            const newItem = {...item, qty: 1}
            setCart([...cart, newItem])
        }

        toast.success("Item added")
    }

    return (
        <div key={item._id}>
            <div id="image" className='bg-gray-200 rounded-md'>
                <Image 
                    src={item?.image || ''}
                    width={350}
                    height={150}
                    alt={item.name}
                    className='w-full h-42 object-cover'
                />
            </div>
            <div id="info">
                <h2 className='text-xl font-bold'>{item.name}</h2>
                <p className='text-xs text-black/50'>{item.description.length > 20 ? item.description.slice(20) + "..." : "readmore.."}</p>
            </div>
            <div id="price-buttons" className='sm:flex mt-2 justify-between'>
                <p className='font-bold text-lg'>₹ {item.price} /-</p>
                <button onClick={() => addToCart()} className='bg-black rounded-full text-white text-xs px-3 py-1 cursor-pointer hover:scale-105 hover:shadow-md hover:font-bold transition-all'>Add to Cart</button>
            </div>
        </div>
    )
}

export default ProductCard