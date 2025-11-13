import React, { useContext, useEffect, useState } from 'react'
import socket from '@/socket';
import { getdetails } from './api/auth';
import InfoContext from '@/context/InfoContext';
import toast from 'react-hot-toast';
import Admin from '@/components/Admin/Admin';
import Customer from '@/components/Customer/Customer';
import Delivery from '@/components/Delivery/Delivery';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { CiShoppingCart } from 'react-icons/ci';

const dashboard = () => {

  const [loading, setLoading] = useState(false)
  const [info, setinfo] = useState(false)
  const [nav, setNav] = useState([])
  const { details, setDetails, cart } = useContext(InfoContext)

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await getdetails()
      if(response){
        console.log(response?.data)
        setDetails(response?.data)
        setinfo(response?.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Logging In");
      console.log("error......", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [])
  
  useEffect(() => {
    if(info?._id){
      socket.emit("register_user", info?._id)
      console.log("regi. on socket: ", info?._id)
      
      socket.on("order_available", (neworder) => {
        if(info.role === "delivery"){
          toast.success("new order in waiting")
        }
      })
      
      
      return () => {
        socket.off("order_available")
        socket.off("order_status_updated")
      }
    
    }
  }, [info])
  

  useEffect(() => {
    if(info){
      let navmenu = []

      if(info?.role === "admin"){
        navmenu.push(
          {
            name: "View All Orders",
            state: "view-all-orders"
          },
          {
            name: "View All Delivery Partners",
            state: "view-delivery-partners"
          }
        )
      }

      if(info?.role === "customer"){
        navmenu.push(
          {
            name: "Product Catalogue",
            state: "product-catalogue"
          },
          {
            name: "My Orders",
            state: "customer-orders"
          },
        )
      }

      if(info?.role === "delivery"){
        navmenu.push(
          {
            name: "Latest Orders",
            state: "view-unassigned-orders"
          },
          {
            name: "My Orders",
            state: "delivery-orders"   
          },
        )
      }

      setNav(navmenu)
    }
  }, [info])
  

  return (
    <div id='container' className={` p-3 ${loading && "flex items-center justify-center"} `}>
      {
        loading ? (
          <ClipLoader />
        ) : (
          <>
            <div id="user-info" className=''>
              <div>
                <p className='font-bold text-3xl capitalize'>{info?.name},</p>
                <p className='font-bold text-sm text-black/40'>{info?.email} • {info?.role}</p>
              </div>
              {
                info?.role === "customer" && (
                  <div className='flex items-center gap-4'>
                    <div id="cart" className='flex items-center gap-1'>
                      {cart.length}
                      <CiShoppingCart size={20}/>
                    </div>
                    {
                      cart.length > 0 && (
                        <Link href={"/cart"} className='p-1 bg-black text-white font-bold px-3 py-1 text-xs rounded-md cursor-pointer transition-all'>
                          <button>Checkout</button>
                        </Link>
                      )
                    }
                  </div>
                ) 
              }
            </div>
            <div id="role-based-content" className='my-3'>
              {info?.role === "admin" && <Admin navmenu={nav}/>}
              {info?.role === "customer" && <Customer navmenu={nav}/>}
              {info?.role === "delivery" && <Delivery navmenu={nav}/>}
            </div>
          </>
        )
      }
    </div>
  )
}

export default dashboard