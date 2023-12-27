import { useEffect, useRef, useState } from "react";
import { MusicRecomendation, Navbar, Splash, Welcome, AudioInput, RecordAudio, AboutUs } from "./components";
import { icon } from './assets'

function App() {
  const [data, setData] = useState([{}])
  const [songs, setSongs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("input");
  const [preview, setPreview] = useState()
  const [about, setAbout] = useState(false)

  const updateAbout = () => {
    if (about == true) {
      setAbout(false);
    } else {
      setAbout(true);
    }
  };
  const updateMode = (newData) => {
    setMode(newData);
  };

  const updateData = (newData) => {
    setData(newData);
  };

  const updateLoading = (newData) => {
    setLoading(newData);
  };

  const updatePreview = (newData) => {
    setPreview(newData);
  };

  // Run jika data dari audio sudah dieksekusi (Mau itu record maupun input)
  useEffect(() => {
    if (data.Key != null) {
      const result = {
        mode: data.Mode,
        tempo: data.Tempo,
        loudness: data.Loudness,
        danceability: data.Danceability,
        liveness: data.Liveness,
        keyindex: data.KeyIndex,
        genre: data.genre
      };

      // Convert the result object into a query string
      const queryString = Object.entries(result)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      // Fetch data from the endpoint with the constructed query string
      fetch(`http://127.0.0.1:5000/getrecomendation?${queryString}`)
        // fetch(`https://wisnudanuarta.pythonanywhere.com/getrecomendation?${queryString}`)
        .then(res => res.json())
        .then(songs => {
          setSongs(songs);
          console.log(songs);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }, [data]);

  return (
    <>
      <Splash />
      <Welcome />
      <div className={`relative ${about == true ? "close-page" : "open-page"}`}>
        <div className="flex justify-between pt-[2vw] px-[2vw] portrait:px-[6vw] portrait:items-center portrait:py-[3vw]">
          <a className="text-[0.8vw] portrait:hidden hover:opacity-50 cursor-pointer" onClick={updateAbout}>About Us</a>
          <h1 className="text-[2.4vw] font-bold normal-font portrait:text-[4vw]">AMPLIFY</h1>
          <img src={icon} className="w-[2vw] portrait:w-[6vw]" alt="" />
        </div>
        <div className="w-full py-[3vw] flex
          portrait:flex-col-reverse
        ">
          <MusicRecomendation data={data} loading={loading} songs={songs} onPreviewUpdate={updatePreview} />
          {mode == 'input' ? (
            <AudioInput onDataUpdate={updateData} onLoadingUpdate={updateLoading} onModeUpdate={updateMode} mode={mode} preview={preview} onPreviewUpdate={updatePreview} />
          ) : (
            <RecordAudio onDataUpdate={updateData} onLoadingUpdate={updateLoading} onModeUpdate={updateMode} mode={mode} />
          )}

        </div>
      </div>

      <div className={`flex flex-col items-center justify-center py-[2vw] mb-[8vw] relative portrait:hidden bg-primary  ${about == false ? "hidden" : ""}`}>
        <h1 className='text-[2vw]'>ABOUT US</h1>
        <h2 className='text-[2vw] font-mono font-bold'>OUR TEAM</h2>
        <div className="flex w-full px-[12vw] pt-[6vw] pb-[4vw] justify-between">
          <div className="flex flex-col items-center justify-center">
            <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/1.png" className='w-[20vw] mb-[3vw]' />
            <div className="wisnu flex items-center justify-center">
              <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/4.png" className='w-[4vw] h-[4vw] mr-[2vw]' />
              <h3 className='text-[0.8vw]'>
                <a href="#">I Ketut Andika Wisnu D.</a>
                <p className='font-sans font-bold text-[1vw]'>162112133115</p>
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/2.png" className='w-[20vw] mb-[3vw]' />
            <div className="wisnu flex items-center justify-center">
              <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/4.png" className='w-[4vw] h-[4vw] mr-[2vw]' />
              <h3 className='text-[0.8vw]'>
                <a href="#">I Ketut Andika Wisnu D.</a>
                <p className='font-sans font-bold text-[1vw]'>162112133115</p>
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/3.png" className='w-[20vw] mb-[3vw]' />
            <div className="wisnu flex items-center justify-center">
              <img alt="wisnu" src="https://intanurul04.alwaysdata.net/uas/4.png" className='w-[4vw] h-[4vw] mr-[2vw]' />
              <h3 className='text-[0.8vw]'>
                <a href="#">I Ketut Andika Wisnu D.</a>
                <p className='font-sans font-bold text-[1vw]'>162112133115</p>
              </h3>
            </div>
          </div>
        </div>
        <h5 className='w-full text-center text-[0.6vw]'>Pembuatan aplikasi ini kami lakukan agar dapat berguna dikemudian hari</h5>

        <button onClick={updateAbout}>
          <img src="https://intanurul04.alwaysdata.net/uas/5.png" className='absolute right-0 top-[12vw] w-[10vw] animate-pulse' />
        </button>
      </div>
      <div className="landscape:hidden h-[20vw]"></div>
    </>
  )
}

export default App
