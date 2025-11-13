import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import AllCustomerOrders from './AllCustomerOrders'
import AllProducts from './AllProducts'
import socket from '@/socket'
import toast from 'react-hot-toast'

const Customer = ({ navmenu }) => {

  const [loading, setLoading] = useState(false)
  const [currentstate, setCurrentstate] = useState("product-catalogue")
  const [menuOpen, setMenuOpen] = useState(false)

  
  return (
    <div id="menus" className='flex flex-col md:flex-row items-start gap-3 h-full select-none w-full'>

      
      <div className='md:hidden flex justify-between items-center w-full mb-2'>
        <h2 className='font-semibold text-gray-800 text-lg'>Dashboard</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className='text-sm px-3 py-1 border rounded-md bg-gray-50 hover:bg-gray-100 transition-all'
        >
          {menuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      <div
        id="menu-items"
        className={`flex flex-col gap-1 w-full md:w-[22%] transition-all duration-200 ${
          menuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        {navmenu.map((item, index) => (
          <div
            id="menu"
            key={index}
            onClick={() => {
              setCurrentstate(item.state)
              setMenuOpen(false)
            }}
            className={`cursor-pointer ${
              currentstate === item.state &&
              'bg-gray-100 text-black/100 font-bold'
            } text-black/70 text-sm px-3 py-2 rounded-md hover:scale-105 hover:bg-gray-100 transition-all hover:font-bold`}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div
        id="menu-content"
        className='w-full md:w-[78%] transition-all duration-300'
      >
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <ClipLoader size={30} color='#333' />
          </div>
        ) : (
          <>
            {currentstate === "product-catalogue" && <AllProducts />}
            {currentstate === "customer-orders" && <AllCustomerOrders />}
          </>
        )}
      </div>

    </div>
  )
}

export default Customer