import React, { useState } from 'react'
import { icon } from '../assets'

const Welcome = () => {
    const [welcome, setWelcome] = useState(false);
    const closePage = (e) => {
        e.preventDefault();
        setWelcome(true);
    };
    return (
        <>
            <div className={`h-[100vh] w-full flex items-center justify-center relative ${welcome == true ? "close-page" : ""} overflow-hidden fixed`}>
                <h1 className="text-end mr-[1vw] text-[2.3vw]">WELCOME TO<br />
                    <span className="mr-[-1vw] normal-font font-bold text-[2.6vw]">AMPLIFY</span>
                </h1>
                <div className="ml-[3vw]">
                    <p className="text-[0.8vw] w-[16vw]">Find best song suits your taste</p>
                    <button className="mt-[2vw] py-[0.9vw] rounded-[0.3vw] px-[1vw] bg-black text-white" onClick={closePage}>Get Started</button>
                </div>
                <img src={icon} className="absolute right-[2vw] top-[2vw] w-[2.5vw]" alt="" />
            </div>
        </>
    )
}

export default Welcome