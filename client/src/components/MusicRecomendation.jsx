import React, { useEffect, useRef, useState } from 'react'
import { cover1, play } from '../assets'

const MusicRecomendation = (props) => {
    const [dots, setDots] = useState('.');
    const containerRef = useRef(null);
    const [randomSong, setRandomSong] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/getrandom');
                const data = await response.json();
                setRandomSong(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length >= 3 ? '.' : prevDots + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    function truncateString(str, maxWords) {
        const words = str.split(' ');

        if (words.length <= maxWords) {
            return str;
        }

        const truncatedWords = words.slice(0, maxWords);
        return truncatedWords.join(' ') + '...';
    }
    return (
        <>
            <div className="w-[50vw] mt-[2vw]">
                <h1 className="text-[1.6vw] w-[30vw] ml-[2vw]">Music Recomendation</h1>
                <div className="flex ml-[2vw]">
                    {props.loading ? (
                        <>
                            <p className="text-[0.6vw] py-[0.5vw] text-[#8888]">Identifying audio{dots}</p>
                        </>
                    ) : props.data.genre != null ? (
                        <>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw] bg-black text-white">
                                {props.data.genre}
                            </p>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw]">
                                {props.data.Key}
                            </p>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw]">
                                {props.data.Mode}
                            </p>
                        </>

                    ) : (
                        <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw] bg-black text-white">
                            All
                        </p>
                    )}
                </div>

                <div className="flex overflow-x-scroll mt-[2vw] relative border-r-[0.2vw] border-[#3e3e3e] py-[1vw]" ref={containerRef}>
                    <div className="flex pr-[3vw] pl-[1vw]">
                        {props.loading ? (
                            <>
                                <p className="text-[#8888] ml-[2vw] py-[10vw] text-[1vw]">Finding Best Music For You{dots}</p>
                            </>
                        ) : props.songs[0].artist != null ? (
                            props.songs.map((item, index) => (
                                <a href={item.link} target="_blank" className="w-[15vw] ml-[1.8vw] flex flex-col justify-start" key={index}>
                                    <img src={item.albumImage} className="w-full rounded-[0.3vw] h-[15vw] object-cover" alt="" />
                                    <div className="flex justify-between items-center mt-[0.4vw]">
                                        <div className="ml-[0.2vw]">
                                            <p className="mt-[0.3vw] text-[0.8vw]">{truncateString(item.trackName, 3)}</p>
                                            <p className="text-[0.5vw]">- {truncateString(item.artist, 4)}</p>
                                        </div>
                                        <img src={play} className="w-[1.6vw] cursor-pointer" alt="" />
                                    </div>
                                </a>
                            ))
                        ) : randomSong != null ? (
                            randomSong.map((item, index) => (
                                <a href={item.link} target="_blank" className="w-[15vw] ml-[1.8vw] flex flex-col justify-start" key={index}>
                                    <img src={item.albumImage} className="w-full rounded-[0.3vw] h-[15vw] object-cover" alt="" />
                                    <div className="flex justify-between items-center mt-[0.4vw]">
                                        <div className="ml-[0.2vw]">
                                            <p className="mt-[0.3vw] text-[0.8vw]">{truncateString(item.trackName, 3)}</p>
                                            <p className="text-[0.5vw]">- {truncateString(item.artist, 4)}</p>
                                        </div>
                                        <img src={play} className="w-[1.6vw] cursor-pointer" alt="" />
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                </div>


                {props.loading ? (
                    <>

                        <div className="flex mt-[1vw] ml-[2vw] w-full">
                            <p className="text-[0.6vw] py-[0.5vw] text-[#8888]">Creating Playlist{dots}</p>
                        </div>

                    </>
                ) : props.data.genre != null ? (
                    <>
                        <h1 className="text-[1.2vw] w-[28vw] ml-[2vw] mt-[1vw]">Check Our Most Famous Playlist</h1>
                        <div className="flex mt-[1vw] ml-[2vw] w-full">
                            <img src={cover1} className="w-[6vw] rounded-[0.4vw]" alt="" />
                            <div className="ml-[1vw] mt-[1vw]">
                                <p className="text-[0.5vw]">Metal</p>
                                <p className="text-[0.7vw]">Playlist User #00001</p>
                            </div>
                            <div className="w-full flex items-center justify-end mr-[5vw]">
                                <a href="" className="text-[0.6vw] ml-[10vw] self-center px-[1vw] py-[0.4vw] bg-black text-white">Open Playlist</a>
                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        <h1 className="text-[1.2vw] w-[28vw] ml-[2vw] mt-[1vw]">Check Our Most Famous Playlist</h1>
                        <div className="flex mt-[1vw] ml-[2vw] w-full">
                            <img src={cover1} className="w-[6vw] rounded-[0.4vw]" alt="" />
                            <div className="ml-[1vw] mt-[1vw]">
                                <p className="text-[0.5vw]">Metal</p>
                                <p className="text-[0.7vw]">Playlist User #00001</p>
                            </div>
                            <div className="w-full flex items-center justify-end mr-[5vw]">
                                <a href="" className="text-[0.6vw] ml-[10vw] self-center px-[1vw] py-[0.4vw] bg-black text-white">Open Playlist</a>
                            </div>
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default MusicRecomendation