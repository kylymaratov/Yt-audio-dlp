# Audio-downloder

This is a library for parsing audio files from YouTube videos in the formats webm | mp3 | wav | opus | ogg.

## Installation

`npm install audio-downloader`

## Usage

```
import AudioDownloder from "audio-downloader";

const audioDownloder = new AudioDownloder();

/* Get audio from youtube */s

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
