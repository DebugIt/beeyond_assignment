import Link from 'next/link'
import React from 'react'
import { FaUser } from "react-icons/fa6"

const Navbar = () => {
  return (
    <div 
      id='container' 
      className='flex items-center justify-between px-4 py-3 bg-white z-10'
    >
      <Link 
        href={"/"} 
        id="name-title" 
        className='font-semibold text-xl sm:text-2xl cursor-pointer hover:scale-[1.02] transition-all'
      >
        Swigato
      </Link>
      
      <div id="icons" className='flex items-center gap-2 sm:gap-3'>
        <Link 
          href={"/Login"} 
          className='p-2 hover:bg-gray-100 rounded-full hover:scale-105 transition-all flex items-center justify-center'
          title="Profile / Login"
        >
          <FaUser size={15}/>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
