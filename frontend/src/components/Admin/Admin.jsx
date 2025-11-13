import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import AllOrders from './AllOrders'
import AllPartners from './AllPartners'
import socket from '@/socket'
import toast from 'react-hot-toast'

const Admin = ({ navmenu }) => {

  const [loading, setLoading] = useState(false)
  const [currentstate, setCurrentstate] = useState("view-all-orders")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    

    socket.on("order_available", () => {
      toast.success("New Order just came in")
    })

  }, [])

  return (
    <div id="menus" className='flex flex-col md:flex-row items-start gap-3 h-full w-full select-none'>

      <div className='md:hidden flex justify-between items-center w-full mb-2'>
        <h2 className='font-semibold text-gray-800 text-lg'>Admin Panel</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='text-sm px-3 py-1 border rounded-md bg-gray-50 hover:bg-gray-100 transition-all'
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

  
      <div
        id="menu-items"
        className={`flex flex-col gap-1 w-full md:w-[25%] transition-all duration-200 ${
          menuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        {
          navmenu.map((item, index) => (
            <div
              id="menu"
              key={index}
              onClick={() => {
                setCurrentstate(item.state)
                setMenuOpen(false)
              }}
              className={`cursor-pointer ${
                currentstate === item.state
                  ? "bg-gray-100 text-black font-bold"
                  : "text-black/70 hover:bg-gray-100 hover:scale-105 hover:font-semibold"
              } text-sm px-3 py-2 rounded-md transition-all`}
            >
              {item.name}
            </div>
          ))
        }
      </div>


      <div
        id="menu-content"
        className='w-full md:w-[75%] bg-white md:p-2 rounded-md overflow-y-auto transition-all duration-300'
      >
        {
          loading ? (
            <div className='flex items-center justify-center h-full py-20'>
              <ClipLoader color='#000' />
            </div>
          ) : (
            <>
              {currentstate === "view-all-orders" && <AllOrders />}
              {currentstate === "view-delivery-partners" && <AllPartners />}
            </>
          )
        }
      </div>

    </div>
  )
}

export default Admin