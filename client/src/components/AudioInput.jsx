import React, { useState, useEffect, useRef } from 'react'
import { audioend, audiostart, cover2, input, mic, play, player, turntable, vinyl2 } from "../assets"

const AudioInput = (props) => {
    const [playCon, setPlaycon] = useState("");
    const [discCon, setDiscCon] = useState("");
    const [file, setFileName] = useState();
    const [timeoutId, setTimeoutId] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(1);
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length >= 3 ? '.' : prevDots + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

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

    // Ngatur Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationDuration((prevDuration) => prevDuration + 0.1);
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Input File
    const fileInputRef = useRef(null);
    const audioRef = useRef(new Audio());
    const playHandlerInput = () => {
        fileInputRef.current.click();
    };

    const handleAudioPlay = () => {
        const selectedFile = fileInputRef.current.files[0];

        if (selectedFile != null) {
            console.log(selectedFile)
            if (audioRef.current && audioRef.current.paused) {
                const newTimeoutId = setTimeout(() => {
                    audioRef.current.src = URL.createObjectURL(selectedFile);
                    audioRef.current.play();
                }, 2000);
            } else if (audioRef.current) {
                audioRef.current.pause();
            }
        }

        audioRef.current.addEventListener('ended', () => {
            console.log('Music has finished playing.');
        });
    };

    const handleFileInputChange = async (e) => {
        const selectedFile = e.target.files[0];

        // Animasi Start
        setPlaycon("player-play");
        setFileName(selectedFile.name)
        console.log(selectedFile)
        const newTimeoutId = setTimeout(() => {
            setDiscCon('true');
        }, 1100);
        props.onLoadingUpdate(true)

        // Audio Start
        handleAudioPlay()

        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await fetch('http://127.0.0.1:5000/', {
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

    return (
        <>
            <div className="overflow-hidden">
                <div className="absolute right-0 top-[13.5vw] flex flex-col">
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode != 'input' ? "bg-black text-white" : ""}`} onClick={() => props.onModeUpdate('record')}>RECORD</button>
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode == 'input' ? "bg-black text-white" : ""}`} onClick={() => props.onModeUpdate('input')}>INPUT</button>
                </div>

                <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]">
                    <h1 className="text-[1vw]">{props.mode == "input" ? "Add New Audio" : "Record New Audio"}</h1>
                    <img src={input} className="ml-[2vw] w-[2vw] cursor-pointer" onClick={playHandlerInput} alt="Click to select file" />
                    <input type="file" name="file" id="" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} accept=".wav, .mp3" />
                </div>

                {/* VINYL */}
                <div className={`flex items-center justify-center relative ml-[2vw] ${props.mode != 'input' ? "hidden" : ""}`}>
                    <div className=""></div>
                    <img src={turntable} className="w-[42vw]" alt="" />
                    <div className={`${playCon == '' ? "left-0" : discCon == "stop" ? "animate-custom-stop left-[3.2vw]" : playCon == "player-play" & discCon == "true" ? "animate-custom-spin left-[3.2vw]" : playCon == "player-play" & discCon == "" ? "disc-play" : "disc-stop"} absolute flex items-center justify-center`}>
                        <img src={vinyl2} className="w-[26.5vw]" />
                    </div>
                    <img src={player} className={`w-[35vw] right-[-10vw] top-[-10vw] absolute ${playCon == "" ? "player-normal" : playCon}`} />
                    {/* <div className="w-[4.1vw] absolute h-[3.5vw] border-[0.4vw] bottom-[1.55vw] left-[0.9vw] border-red-500 animate-pulse rounded-[0.2vw]"></div> */}
                </div>


                {file != null ? (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw]">{file}</h2>
                            <p className="text-[0.7vw] loading-text text-[#888888]">Loading{dots}</p>
                        </div>
                        <div className="mt-[1.5vw] flex w-full items-center justify-between">
                            <p className="text-[1vw]">2:00</p>
                            <div className="relative">
                                <img src={audioend} className="absolute h-full object-cover object-left transition-width duration-100s" style={{ width: `${animationDuration}%` }} />
                                <img src={audiostart} className="w-[30vw]" alt="" />
                            </div>
                            <img src={play} className="cursor-pointer" onClick={playHandler} />
                        </div>
                        <audio ref={audioRef} controls style={{ visibility: 'hidden' }}>
                            <source src="" type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] text-[#888888]">No audio has been inserted</h2>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default AudioInput