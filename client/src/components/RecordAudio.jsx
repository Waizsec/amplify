import React, { useState, useEffect, useRef } from 'react';
import { input, mic } from '../assets';
const RecordAudio = (props) => {
    const [dots, setDots] = useState('.');
    const [recordingStatus, setRecordingStatus] = useState('');

    const startRecording = () => {
        const shouldContinue = window.confirm("Do you really want to record audio?");
        if (shouldContinue) {
            setRecordingStatus('record');
            props.onLoadingUpdate(true);

            const newTimeoutId = setTimeout(() => {
                startFetch();
            }, 1100);
        }
    }
    const startFetch = async () => {
        const response = await fetch('http://127.0.0.1:5000/startrecording', { method: 'POST' });
        const data = await response.json();
        console.log(data)
        setRecordingStatus('done');
        props.onDataUpdate(data)
        props.onLoadingUpdate(false)
    };

    return (
        <>
            <div className="overflow-hidden">
                <div className="absolute right-0 top-[13.5vw] flex flex-col">
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode != 'input' ? "bg-black text-white" : ""}`} onClick={() => props.onModeUpdate('record')}>RECORD</button>
                    <button className={`rotate-90 px-[0.7vw] my-[2vw] py-[0.2vw] text-[0.7vw]  border-[0.2vw] border-black ${props.mode == 'input' ? "bg-black text-white" : ""}`} onClick={() => props.onModeUpdate('input')}>INPUT</button>
                </div>

                {recordingStatus == 'record' ? (
                    <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]">
                        <h1 className="text-[1vw]">Your Record Is Being Processed!</h1>
                    </div>

                ) : (
                    <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]">
                        <h1 className="text-[1vw]">Record New Audio</h1>
                        <button onClick={startRecording}>
                            <img src={input} className="ml-[2vw] w-[2vw] cursor-pointer" alt="Click to select file" />
                        </button>
                    </div>

                )}


                {/* MIC */}
                <div className={`${props.mode != 'record' ? "hidden" : ''} flex items-center justify-center py-[3vw]`}>
                    <img src={mic} className="w-[10vw] object-cover ml-[15vw]" />
                </div>


                {recordingStatus === "record" ? (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] text-[#888888]">Recording Audio{dots}</h2>
                        </div>
                    </div>
                ) : recordingStatus === "done" ? (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] text-[#888888]">Successfully Classifying Audio</h2>
                        </div>
                    </div>
                ) : (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] text-[#888888]">No Record Yet</h2>
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="fixed w-full h-screen flex items-center justify-center top-0">
                <div className="w-[40vw] h-[35vw]  rounded-[1vw] bg-white opacity-75"></div>
            </div> */}
        </>
    )
}

export default RecordAudio