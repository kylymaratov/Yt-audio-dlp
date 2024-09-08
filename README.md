# Ytdl-audio

This is a library for parsing audio files from YouTube videos in the formats webm | mp3 | wav | opus | ogg.

## Installation

`npm install ytdl-audio`

## Usage

```
import YoutubeDlp from "ytdl-audio";

const ytdlAudio = new YtdlAudio();

(async function() {
   try {
    const {audio, stream, headers, options } = await ytdlAudio.getAudioById(/ VideoId /, {outputFormat: "mp3", socks?: "Socks proxy link", proxy?: {host: "HOST" port: "PORT", auth?: {username:"", password: ""}} });

  } catch (err) {
    console.error(err);
  }
})()

fetchAudio();

OR

ytdlAudio.getAudioById(/ VideoId /)
  .then(res => console.log(res))
  .catch(err => console.log(err))
```
