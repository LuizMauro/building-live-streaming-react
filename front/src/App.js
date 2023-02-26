import { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";

function App() {
  const [url, setUrl] = useState(null);

  const getUrl = async () => {
    const { data } = await axios.post("http://localhost:3333/", {
      liveURL: "live1",
    });

    if (data.url) {
      setUrl(data.url);
    }
  };

  useEffect(() => {
    getUrl();
  }, []);

  return <>{url ? <VideoPlayer src={url} /> : "Loading..."}</>;
}

export default App;
