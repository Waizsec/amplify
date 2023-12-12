import React from 'react'
import { icon } from '../assets'

const Navbar = () => {
    return (
        <>
            <div className="flex justify-between pt-[2vw] px-[2vw]">
                <a href="" className="text-[0.8vw]">About Us</a>
                <h1 className="text-[1.7vw] font-semibold normal-font">AMPLIFY</h1>
                <img src={icon} className="w-[2vw]" alt="" />
            </div>
        </>
    )
}

export default Navbar