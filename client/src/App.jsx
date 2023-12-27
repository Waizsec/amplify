import { useEffect, useRef, useState } from "react";
import { MusicRecomendation, Navbar, Splash, Welcome, AudioInput, RecordAudio } from "./components";

function App() {
  const [data, setData] = useState([{}])
  const [songs, setSongs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("input");
  const [preview, setPreview] = useState()

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
      <div className="relative">
        <Navbar />
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
      <div className="landscape:hidden h-[20vw]"></div>
    </>
  )
}

export default App
