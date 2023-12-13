import React from 'react'
import { icon } from '../assets'

const Navbar = () => {
    return (
        <>
            <div className="flex justify-between pt-[2vw] px-[2vw] portrait:px-[6vw] portrait:items-center portrait:py-[3vw]">
                <a href="" className="text-[0.8vw] portrait:hidden">About Us</a>
                <h1 className="text-[2.4vw] font-bold normal-font portrait:text-[4vw]">AMPLIFY</h1>
                <img src={icon} className="w-[2vw] portrait:w-[6vw]" alt="" />
            </div>
        </>
    )
}

export default Navbar