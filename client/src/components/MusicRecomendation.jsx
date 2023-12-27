import React, { useEffect, useRef, useState } from 'react'
import { cover1, play } from '../assets'
import { playlists } from '../constant';

const MusicRecomendation = (props) => {
    const [dots, setDots] = useState('.');
    const containerRef = useRef(null);
    const [randomSong, setRandomSong] = useState()
    const [isScrolled, setisScrolled] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;

            if (container) {
                const isContainerScrolledHorizontally = container.scrollLeft > 0;

                setisScrolled(true);
                const newTimeoutId = setTimeout(() => {
                    setisScrolled(false);
                }, 10000);
            }
        };

        // Use 'scroll' event on the container element
        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            // Cleanup the event listener
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/getrandom');
                // const response = await fetch('https://wisnudanuarta.pythonanywhere.com/getrandom');
                const data = await response.json();
                setRandomSong(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
            <div className="w-[50vw] mt-[2vw]
                portrait:w-[100vw] portrait:mt-[10vw]
            ">
                <h1 className="text-[1.6vw] w-[30vw] ml-[2vw]
                    portrait:text-[5vw] portrait:ml-[6vw]
                ">Music Recomendation</h1>
                <div className="flex ml-[2vw]
                    portrait:ml-[6vw]
                ">
                    {props.loading ? (
                        <>
                            <p className="text-[0.6vw] py-[0.5vw] text-[#8888] portrait:text-[2vw]">Identifying audio{dots}</p>
                        </>
                    ) : props.data.genre != null ? (
                        <>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw] bg-black text-white
                                 portrait:text-[2vw] portrait:mt-[4vw] portrait:px-[3vw] portrait:py-[2vw] portrait:rounded-[1vw]
                            ">
                                {props.data.genre}
                            </p>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw]
                                 portrait:text-[2vw] portrait:mt-[4vw] portrait:px-[3vw] portrait:py-[2vw] portrait:rounded-[1vw]
                            ">
                                {props.data.Key}
                            </p>
                            <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw]
                                 portrait:text-[2vw] portrait:mt-[4vw] portrait:px-[3vw] portrait:py-[2vw] portrait:rounded-[1vw]
                            ">
                                {props.data.Mode}
                            </p>
                        </>

                    ) : (
                        <p className="px-[1vw] py-[0.5vw] rounded-[0.3vw] mt-[1vw] text-[0.6vw] border-[0.2vw] border-black mr-[1vw] bg-black text-white
                            portrait:text-[2vw] portrait:mt-[4vw] portrait:px-[3vw] portrait:py-[2vw]
                        ">
                            All
                        </p>
                    )}
                </div>

                <div className="flex overflow-x-scroll mt-[2vw] relative border-r-[0.2vw] border-[#3e3e3e] py-[1vw] portrait:mt-[5vw] portrait:border-none" ref={containerRef}>
                    <div className={`flex pr-[3vw] pl-[1vw] ${isScrolled || props.loading ? "" : "animate-scroll"} portrait:pr-0 portrait:pl-0`}>
                        {props.loading ? (
                            <>
                                <p className="text-[#8888] ml-[2vw] py-[10vw] text-[1vw] portrait:text-[2.8vw] portrait:ml-[8vw]">Finding Best Music For You{dots}</p>
                            </>
                        ) : props.songs != null ? (
                            props.songs.map((item, index) => (
                                <div className="w-[15vw] ml-[1.8vw] flex flex-col justify-start
                                    portrait:w-[40vw] portrait:ml-[4vw]
                                " key={index}>
                                    <img src={item.albumImage} className="w-full rounded-[0.3vw] h-[15vw] object-cover
                                        portrait:w-[40vw] portrait:h-[40vw] portrait:rounded-[2vw]
                                    "  />
                                    <div className="flex justify-between items-center mt-[0.4vw]">
                                        <div className="ml-[0.2vw]">
                                            <p className="mt-[0.3vw] text-[0.8vw] portrait:text-[3vw]">{truncateString(item.trackName, 3)}</p>
                                            <p className="text-[0.5vw] portrait:text-[1.5vw]">- {truncateString(item.artist, 4)}</p>
                                        </div>
                                        <img src={play} className="w-[1.6vw] cursor-pointer portrait:w-[5vw]" onClick={() => props.onPreviewUpdate({ pre: item.preview_url, img: item.albumImage, name: item.trackName })} alt="" />
                                    </div>
                                </div>
                            ))
                        ) : randomSong != null ? (
                            randomSong.map((item, index) => (
                                <div className="w-[15vw] ml-[1.8vw] flex flex-col justify-start
                                    portrait:w-[40vw] portrait:ml-[4vw]
                                " key={index}>
                                    <img src={item.albumImage} className="w-full rounded-[0.3vw] h-[15vw] object-cover
                                        portrait:w-[40vw] portrait:h-[40vw] portrait:rounded-[2vw]
                                    "  />
                                    <div className="flex justify-between items-center mt-[0.4vw]">
                                        <div className="ml-[0.2vw]">
                                            <p className="mt-[0.3vw] text-[0.8vw] portrait:text-[3vw]">{truncateString(item.trackName, 3)}</p>
                                            <p className="text-[0.5vw] portrait:text-[1.5vw]">- {truncateString(item.artist, 4)}</p>
                                        </div>
                                        <img src={play} className="w-[1.6vw] cursor-pointer portrait:w-[5vw]" onClick={() => props.onPreviewUpdate({ pre: item.preview_url, img: item.albumImage, name: item.trackName })} alt="" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                </div>


                {props.loading ? (
                    <>

                        <div className="flex mt-[1vw] ml-[2vw] w-full portrait:ml-[8vw] portrait:w-[80vw]">
                            <p className="text-[0.6vw] py-[0.5vw] text-[#8888] portrait:text-[2vw]">Creating Playlist{dots}</p>
                        </div>

                    </>
                ) : props.data.genre != null ? (
                    <>
                        <h1 className="text-[1.2vw] w-[28vw] ml-[2vw] mt-[1vw] portrait:text-[3vw] portrait:w-[80vw] portrait:ml-[6vw]">Check Our Most Famous Playlist</h1>
                        <div className="flex mt-[1vw] ml-[2vw] w-full portrait:ml-[6vw] portrait:w-[80vw] portrait:mt-[4vw]">
                            <img src={cover1} className="w-[6vw] rounded-[0.5vw] portrait:rounded-[2vw] portrait:w-[30vw]" alt="" />
                            <div className="ml-[1vw] mt-[1vw] portrait:ml-[3vw]">
                                <p className="text-[0.5vw] portrait:text-[3vw]">AMPLIFY  </p>
                                <p className="text-[0.9vw] portrait:text-[2.5vw]">Playlist : {props.data.genre}</p>
                            </div>
                            <div className="w-full flex items-center justify-end mr-[5vw]">
                                {/* Conditionally set the href based on the genre */}
                                <a
                                    href={props.data.genre in playlists ? playlists[props.data.genre] : ''} target='_blank'
                                    className="text-[0.6vw] ml-[10vw] self-center px-[1vw] py-[0.4vw] bg-black text-white portrait:text-[2vw] portrait:py-[2vw] portrait:px-[4vw] portrait:rounded-[2vw]"
                                >
                                    Open Playlist
                                </a>
                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        <h1 className="text-[1.2vw] w-[28vw] ml-[2vw] mt-[1vw] portrait:text-[3vw] portrait:w-[80vw] portrait:ml-[6vw]">Check Our Most Famous Playlist</h1>
                        <div className="flex mt-[1vw] ml-[2vw] w-full portrait:ml-[6vw] portrait:w-[80vw] portrait:mt-[4vw]">
                            <img src={cover1} className="w-[6vw] rounded-[0.5vw] portrait:rounded-[2vw] portrait:w-[30vw]" alt="" />
                            <div className="ml-[1vw] mt-[1vw] portrait:ml-[3vw]">
                                <p className="text-[0.5vw] portrait:text-[3vw]">Amplify</p>
                                <p className="text-[0.7vw] portrait:text-[2.5vw]">Favorite Playlist #00001</p>
                            </div>
                            <div className="w-full flex items-center justify-end mr-[5vw]">
                                <a href="" className="text-[0.6vw] ml-[10vw] self-center px-[1vw] py-[0.4vw] bg-black text-white portrait:text-[2vw] portrait:py-[2vw] portrait:px-[4vw] portrait:rounded-[2vw]">Open Playlist</a>
                            </div>
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default MusicRecomendation