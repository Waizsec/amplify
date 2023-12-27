import React, { useState, useEffect, useRef } from 'react'
import { audioend, audiostart, cover2, input, mic, play, player, turntable, vinyl2 } from "../assets"

const AudioInput = (props) => {
    const [playCon, setPlaycon] = useState("");
    const [discCon, setDiscCon] = useState("");
    const [file, setFileName] = useState();
    const [timeoutId, setTimeoutId] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(1);
    const [dots, setDots] = useState('.');
    const fileInputRef = useRef(null);
    const audioRef = useRef(new Audio());
    const previewRef = useRef(new Audio());
    const [img, setImg] = useState()

    // Preview Player and Remover
    useEffect(() => {
        if (props.preview && props.preview.pre != null) {
            playHandler()
            previewRef.current = new Audio(props.preview.pre);
            setImg(props.preview.img)
            const newTimeoutId = setTimeout(() => {
                previewRef.current.play();
            }, 2000);
        }
    }, [props.preview]);

    const handlePreviewStop = () => {
        setDiscCon('stop');
        const newTimeoutId = setTimeout(() => {
            setPlaycon("player-stop");
            setDiscCon('')
            previewRef.current.pause();
            previewRef.current = new Audio();;
            props.onPreviewUpdate(null)
            setImg(null)
        }, 1100);

    }

    // Input Audio Player and Stop
    const playHandler = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        if (playCon === "player-stop" || playCon === "") {
            setPlaycon("player-play");
            const newTimeoutId = setTimeout(() => {
                handleAudioPlay()
                setDiscCon('true');
            }, 1100);
            setTimeoutId(newTimeoutId);
        } else {
            handleAudioPlay()
            setDiscCon('stop');
            const newTimeoutId = setTimeout(() => {
                setPlaycon("player-stop");
                setDiscCon('')
            }, 1000);
            setTimeoutId(newTimeoutId);
        }
    };

    const handleAudioPlay = () => {
        const selectedFile = fileInputRef.current.files[0];
        if (selectedFile != null) {
            if (audioRef.current && audioRef.current.paused && playCon == "player-stop") {
                const newTimeoutId = setTimeout(() => {
                    audioRef.current.play();
                }, 2000);
            } else if (audioRef.current) {
                audioRef.current.pause();
            }
        }
        audioRef.current.addEventListener('ended', () => {
            playHandler()
            console.log("test")
        });
    };

    // Ngatur Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationDuration((prevDuration) => prevDuration + 0.30);
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Input File
    const inputHandler = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = async (e) => {
        const selectedFile = e.target.files[0];
        setPlaycon("player-play");
        setFileName(selectedFile.name)
        console.log(selectedFile)
        const newTimeoutId = setTimeout(() => {
            setDiscCon('true');
            audioRef.current.src = URL.createObjectURL(selectedFile);
            audioRef.current.play();
        }, 1100);
        props.onLoadingUpdate(true)

        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await fetch('http://127.0.0.1:5000', {
                // const response = await fetch('https://wisnudanuarta.pythonanywhere.com/', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                props.onDataUpdate(jsonResponse);
                console.log('File uploaded successfully:', jsonResponse);
                props.onLoadingUpdate(false)
                // Handle the response data as needed
            } else {
                console.error('File upload failed');
            }
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };


    // Efek Animasi
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
            <div className="overflow-hidden">
                <div className="absolute right-0 top-[13.5vw] flex flex-col z-[20]
                    portrait:bottom-[-2vw] portrait:top-auto portrait:fixed portrait:flex-row
                ">
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode != 'input' ? "bg-black text-white" : "bg-primary"}
                        portrait:rotate-0  portrait:py-[4vw] portrait:px-[3vw] portrait:text-[3vw]
                    `} onClick={() => props.onModeUpdate('record')}>RECORD</button>
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode == 'input' ? "bg-black text-white" : "bg-primary"}
                        portrait:rotate-0  portrait:py-[4vw] portrait:px-[3vw] portrait:text-[3vw]
                    `} onClick={() => props.onModeUpdate('input')}>INPUT</button>
                </div>

                <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]
                     portrait:mt-[10vw]
                ">
                    <h1 className="text-[1vw]
                        portrait:text-[3.5vw] portrait:ml-[7vw]
                    ">Add New Audio</h1>
                    <img src={input} className="ml-[2vw] w-[2vw] cursor-pointer
                        portrait:w-[5vw] portrait:ml-[4vw] z-[10]
                    " onClick={inputHandler} alt="Click to select file" />
                    <input type="file" name="file" id="" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} accept=".wav, .mp3" />
                </div>

                {/* VINYL */}
                <div className={`flex items-center justify-center relative ml-[2vw] ${props.mode != 'input' ? "hidden" : ""}
                     portrait:mt-[5vw]
                `}>
                    <div className=""></div>
                    <img src={turntable} className="w-[42vw]
                        portrait:w-[85vw]
                    " />
                    <div className={`${playCon == '' ? "left-0" : discCon == "stop" ? "animate-custom-stop left-[3.2vw] portrait:left-[12vw]" : playCon == "player-play" & discCon == "true" ? "animate-custom-spin left-[3.2vw] portrait:left-[12vw]" : playCon == "player-play" & discCon == "" ? "disc-play" : "disc-stop"} absolute flex items-center justify-center`}>
                        <img src={vinyl2} className="w-[26.5vw] portrait:w-[55vw]" />
                        {img != null ? (
                            <img src={img} className='absolute w-[10vw] rounded-full' alt="" />
                        ) : (
                            <div className=""></div>
                        )}
                    </div>
                    <img src={player} className={`w-[35vw] right-[-10vw] top-[-10vw] absolute ${playCon == "" ? "player-normal" : playCon} portrait:w-[70vw] portrait:right-[-15vw] portrait:top-[-19vw]`} />
                    {/* <div className="w-[4.1vw] absolute h-[3.5vw] border-[0.4vw] bottom-[1.55vw] left-[0.9vw] border-red-500 animate-pulse rounded-[0.2vw]"></div> */}
                </div>


                {file != null ? (
                    <div className="ml-[2vw] mt-[1vw] portrait:mx-[9vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] portrait:text-[3.5vw]">{truncateString(file, 3)}</h2>
                            <p className="text-[0.7vw] loading-text text-[#888888]">Loading{dots}</p>
                        </div>
                        <div className="mt-[1.5vw] flex w-full items-center justify-between portrait:mt-[4vw]">
                            <p className="text-[1vw] portrait:text-[2.7vw]">00:30</p>
                            <div className="relative">
                                <img src={audioend} className="absolute h-full object-cover object-left transition-width duration-100s" style={{ width: `${animationDuration}%` }} />
                                <img src={audiostart} className="w-[30vw] portrait:h-[10vw] portrait:w-[45vw]" alt="" />
                            </div>
                            <img src={play} className="cursor-pointer" onClick={playHandler} />
                        </div>
                        <audio ref={audioRef} style={{ visibility: 'hidden' }} className='portrait:hidden'>
                            <source src="" type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (props.preview != null && props.preview.pre && props.preview.name ? (
                    <div className="ml-[2vw] mt-[1vw] portrait:mx-[9vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] portrait:text-[3.5vw]">{truncateString(props.preview.name, 4)}</h2>
                        </div>
                        <div className="mt-[1.5vw] flex w-full items-center justify-between portrait:mt-[4vw]">
                            <p className="text-[1vw] portrait:text-[2.7vw]">00:30</p>
                            <div className="relative">
                                <img src={audioend} className="absolute h-full object-cover object-left transition-width duration-100s" style={{ width: `${animationDuration}%` }} />
                                <img src={audiostart} className="w-[30vw] portrait:h-[10vw] portrait:w-[45vw]" alt="" />
                            </div>
                            <img src={play} className="cursor-pointer" onClick={() => handlePreviewStop(null)} />
                        </div>
                        <audio ref={previewRef} controls style={{ visibility: 'hidden' }} className='portrait:hidden'>
                            <source src="" type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] text-[#888888] portrait:text-[3vw] portrait:ml-[7vw] portrait:mt-[5vw]">No audio has been inserted</h2>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default AudioInput