import React, { useState } from 'react'
import { PiPasswordBold, PiPasswordDuotone } from "react-icons/pi"

const Input = ({ type, value, textfunc, required, label, placeholder }) => {

    const [showpass, setShowPass] = useState(false)

    return (
        <div id='input-container' className=''>
            {
                label && (
                    <div id="label" className='capitalize text-xs'>
                        {label} {required && "*"}
                    </div>
                )
            }
            <div id="field-type" className=''>
                {
                    type !== "password" && (
                        <input 
                            className='border border-black/40 focus:border-2 focus:border-black/70 rounded-md outline-none transition-all px-3 py-1 text-sm w-full'
                            placeholder={placeholder}
                            required={required}
                            value={value}
                            type={type}
                            onChange={textfunc}
                        />
                    )
                }

                {
                    type === "password" && (
                        <div className='flex items-center gap-2 border border-black/40 focus:border-2 focus:border-black/70 rounded-md outline-none transition-all px-3 py-1 text-sm w-full'>
                            <input 
                                className='w-full outline-none'
                                placeholder={placeholder}
                                required={required}
                                value={value}
                                onChange={textfunc}
                                type={showpass ? "text" : "password"}
                            />
                            {
                                showpass ? (
                                    <PiPasswordDuotone onClick={() => setShowPass(!showpass)}/>
                                ) : (
                                    <PiPasswordBold onClick={() => setShowPass(!showpass)}/>
                                )
                            }                    
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Input