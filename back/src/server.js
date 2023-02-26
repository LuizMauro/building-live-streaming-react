const express = require("express");
const cors = require("cors");
const NodeMediaServer = require("node-media-server");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

// Configura o servidor RTMP para receber o stream do OBS ou outros programas
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
  },
  trans: {
    ffmpeg: ffmpeg.path,
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        dash: true,
        mp4: true,
        mp4Flags: "[movflags=frag_keyframe+empty_moov]",
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

// Inicia o servidor de streaming
nms.run();

const returnMediaURL = (StreamPath) => {
  let mediaUrl = "";

  if (StreamPath === "live1") {
    mediaUrl = `http://localhost:8000/live/teste123/index.m3u8`;
  }

  return mediaUrl;
};

// Emite a URL do servidor de mídia para o front-end React quando é aberto live diretamente no OBS e o front está aberto
nms.on("postPublish", (id, StreamPath, args) => {
  returnMediaURL(StreamPath);
  io.emit("mediaUrl", returnMediaURL());
});

const app = express();

app.use(express.json());
app.use(cors());

// A live já está aberta o front entra pedindo um link de media
app.post("/", function (req, res) {
  res.json({
    url: returnMediaURL(req.body.liveURL),
  });
});

app.listen(3333, () => {
  console.log(`Example app listening on port ${3333}`);
});
