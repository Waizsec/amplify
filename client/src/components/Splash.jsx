import React, { useEffect, useState } from 'react'
import { vinyl2 } from '../assets'

const Splash = () => {
    const [splashScreen, setSplashScreen] = useState(true);
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length >= 3 ? '.' : prevDots + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const newTimeoutId = setTimeout(() => {
        setSplashScreen(false)
    }, 1000);
    return (
        <>
            {/* Splash Screen */}
            <div className={`${splashScreen == false ? "hidden" : ""} fixed w-[100vw] h-screen bg-primary z-[20] flex flex-col items-center justify-center`}>
                <h1 className="normal-font font-bold text-[4vw]">AMPLIFY</h1>
                <img src={vinyl2} className="w-[13vw] animate-spin" alt="" />
                <p className="text-[#8888] mt-[1vw]">Loading Page{dots}</p>
            </div>
        </>
    )
}

export default Splash