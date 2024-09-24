# Yt-audio-dlp

Node.js library for downloading songs from popular music platforms in formats webm, mp3, wav, opus, ogg formats

## Installation

`npm install audio-downloader`

## Usage

### From Youtube

```
import AudioDownloder from "audio-downloader";

const audioDownloder = new AudioDownloder();

(async function() {
   try {
    const {audio, stream, headers, options } = await audioDownloder.youtube.getAudioById(/ VideoId /,
    {
      outputFormat: "mp3",
      socks?: "Socks proxy link",
      proxy?: {host: "HOST" port: "PORT", auth?: {username:"", password: ""}}
    });

  } catch (err) {
    console.error(err);
  }
})()

```
