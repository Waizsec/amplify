import React, { useState } from 'react'
import { icon } from '../assets'

const Welcome = () => {
    const [welcome, setWelcome] = useState(() => {
        const storedWelcome = sessionStorage.getItem('welcome');
        return storedWelcome === null ? false : true;
    });

    const closePage = (e) => {
        e.preventDefault();
        setWelcome(true);
        sessionStorage.setItem('welcome', 'true');
    };

    return (
        <>
            <div className={`h-[100vh] w-full flex items-center justify-center relative ${welcome == true ? "close-page" : ""} overflow-hidden fixed
                portrait:flex-col
            `}>
                <h1 className="text-end mr-[1vw] text-[2.3vw]
                    portrait:text-[5vw] portrait:text-center
                ">WELCOME TO<br />
                    <span className="mr-[-1vw] normal-font font-bold text-[3.6vw]
                        portrait:text-[8vw]
                    ">AMPLIFY</span>
                </h1>
                <div className="ml-[3vw] portrait:flex portrait:items-center portrait:justify-center portrait:flex-col">
                    <p className="text-[0.8vw] w-[16vw]
                        portrait:text-[3vw] portrait:mt-[2vw] portrait:text-center portrait:w-[70vw]
                    ">Find best song suits your taste</p>
                    <button className="mt-[2vw] py-[0.9vw] rounded-[0.3vw] text-[1vw] px-[1vw] bg-black text-white
                        portrait:py-[3vw] portrait:px-[4vw] portrait:text-[3vw]
                    " onClick={closePage}>Get Started</button>
                </div>
                <img src={icon} className="absolute right-[2vw] top-[2vw] w-[2.5vw]
                    portrait:w-[10vw] portrait:top-[5vw] portrait:right-[5vw]
                " alt="" />
            </div>
        </>
    )
}

export default Welcome