import React, { useEffect, useState } from 'react'
import OrdersToDeliver from './OrdersToDeliver'
import NewOrders from './NewOrders'
import socket from '@/socket'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const Delivery = ({ navmenu }) => {

  const [loading, setLoading] = useState(false)
  const [currentstate, setCurrentstate] = useState("view-unassigned-orders")

  useEffect(() => {
    const handleNewOrder = (newOrder) => {
      toast.success("New order just came in!")
    }

    socket.on("order_available", handleNewOrder)

    // ✅ cleanup on unmount
    return () => {
      socket.off("order_available", handleNewOrder)
    }
  }, [])

  return (
    <div id="menus" className='flex flex-col md:flex-row items-start gap-3 h-full w-full select-none'>

      {/* Sidebar / Menu */}
      <div 
        id="menu-items" 
        className='flex md:flex-col flex-row md:w-[25%] w-full overflow-x-auto md:overflow-visible gap-2 md:gap-1 border-b md:border-b-0 md:border-r border-gray-200 md:pr-2 pb-2 md:pb-0'
      >
        {navmenu.map((item, index) => (
          <div 
            id="menu" 
            key={index} 
            onClick={() => setCurrentstate(item.state)} 
            className={`whitespace-nowrap cursor-pointer text-sm px-3 py-2 rounded-md transition-all 
              ${currentstate === item.state 
                ? "bg-gray-100 text-black font-bold" 
                : "text-black/70 hover:bg-gray-100 hover:scale-105 hover:font-semibold"}`}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div 
        id="menu-content" 
        className='w-full md:w-[75%] bg-white md:p-2 rounded-md overflow-y-auto'
      >
        {loading ? (
          <div className='flex items-center justify-center h-full py-20'>
            <ClipLoader color='#000' />
          </div>
        ) : (
          <>
            {currentstate === "view-unassigned-orders" && <NewOrders />}
            {currentstate === "delivery-orders" && <OrdersToDeliver />}
          </>
        )}
      </div>
    </div>
  )
}

export default Delivery