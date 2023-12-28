import React, { useState, useEffect, useRef } from 'react';
import { input, mic } from '../assets';


const RecordAudio = (props) => {
    const [dots, setDots] = useState('.');
    const [recordingStatus, setRecordingStatus] = useState('');
    const recorderRef = useRef(null);

    const loadMicRecorder = async () => {
        if (!recorderRef.current) {
            // Dynamically load mic-recorder-to-mp3 from CDN
            const recorderScript = document.createElement('script');
            recorderScript.src = 'https://unpkg.com/mic-recorder-to-mp3@2.2.1/dist/index.min.js';
            document.head.appendChild(recorderScript);

            // Wait for the script to be loaded
            await new Promise(resolve => {
                recorderScript.onload = resolve;
            });

            // Initialize MicRecorder after the script is loaded
            recorderRef.current = new MicRecorder({
                bitRate: 128,
                encoderPath: 'https://unpkg.com/lamejs@1.2.2/dist/lame.all.min.js',
            });

            console.log('MicRecorder is ready:', recorderRef.current);
        }
    };

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Access to the microphone has been granted
            console.log('Microphone access granted:', stream);

            // Initialize MicRecorder after permission is granted
            await loadMicRecorder();

            // Start recording
            try {
                await recorderRef.current.start();
                setTimeout(() => {
                    stopRecording();
                }, 15000); // Stop recording after 15 seconds
            } catch (error) {
                console.error('Error starting recording:', error);
                // Handle recording start error
            }
        } catch (error) {
            // Access to the microphone was denied or an error occurred
            console.error('Error requesting microphone access:', error);
        }
    };

    const startRecording = async () => {
        const shouldContinue = window.confirm('Do you really want to record audio?');
        if (shouldContinue) {
            setRecordingStatus('record');
            props.onLoadingUpdate(true);

            // Request microphone permission
            requestMicrophonePermission();
        }
    };

    const stopRecording = async () => {
        try {
            const [buffer, blob] = await recorderRef.current.stop().getMp3();

            const formData = new FormData();
            formData.append('audio_file', new File(buffer, 'recording.mp3', { type: blob.type }));
            const response = await fetch('https://wisnudanuarta.pythonanywhere.com/startrecording', {
                // const response = await fetch('http://127.0.0.1:5000/startrecording', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log("Responnya : ", data);

            setRecordingStatus('done');
            props.onDataUpdate(data);
            props.onLoadingUpdate(false);
        } catch (error) {
            alert('An error occurred while processing the audio');
            console.error(error);
            // Handle recording stop error
        }
    };


    return (
        <>
            <div className="overflow-hidden portrait:mt-[8vw]">
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

                {recordingStatus == 'record' ? (
                    <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]">
                        <h1 className="text-[1vw] portrait:text-[3.5vw] portrait:ml-[4vw]">Your Record Is Being Processed!</h1>
                    </div>

                ) : (
                    <div id='submitaudio' className="flex items-center ml-[2vw] mb-[1vw] mt-[2vw]">
                        <h1 className="text-[1vw] portrait:text-[3.5vw] portrait:ml-[4vw]">Record New Audio</h1>
                        <button onClick={startRecording}>
                            <img src={input} className="ml-[2vw] w-[2vw] cursor-pointer        
                            portrait:w-[5vw] portrait:ml-[4vw] " alt="Click to select file" />
                        </button>
                    </div>
                )}


                {/* MIC */}
                <div className={`${props.mode != 'record' ? "hidden" : ''} flex items-center justify-center py-[3vw]`}>
                    <img src={mic} className="w-[10vw] object-cover ml-[15vw] portrait:w-[20vw] portrait:ml-0 portrait:my-[2vw]" />
                </div>


                {recordingStatus === "record" ? (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] portrait:text-[3.5vw] portrait:ml-[4vw] text-[#888888]">Recording Audio{dots}</h2>
                        </div>
                    </div>
                ) : recordingStatus === "done" ? (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] portrait:text-[3.5vw] portrait:ml-[4vw] text-[#888888]">Successfully Classifying Audio</h2>
                        </div>
                    </div>
                ) : (
                    <div className="ml-[2vw] mt-[1vw]">
                        <div className="flex w-full justify-between">
                            <h2 className="text-[1vw] portrait:text-[3.5vw] portrait:ml-[4vw] text-[#888888]">No Record Yet</h2>
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