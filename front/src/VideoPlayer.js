import React from "react";
import Hls from "hls.js";

function VideoPlayer({ src }) {
  const refPlayer = React.useRef(null);

  React.useEffect(() => {
    if (src && refPlayer) {
      const video = refPlayer.current;
      const hls = new Hls();
      const url = src;

      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    }
  }, [src, refPlayer]);

  return (
    <div>
      <video className="videoCanvas" ref={refPlayer} autoPlay={true} controls />
    </div>
  );
}

export default VideoPlayer;
