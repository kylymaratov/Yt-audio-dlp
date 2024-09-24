# Yt-audio-dlp

![Logo](https://upload.wikimedia.org/wikipedia/commons/2/20/Youtube-to-mp3.png)

Node.js library for downloading songs from Youtube in webm, mp3, wav, opus, ogg formats

## Installation

`npm install yt-audio-dlp`

Make sure you're installing the latest version of yt-auido-dlp to keep up with the latest fixes.

## Example

```js
import YoutubeAudio from "yt-audio-dlp";

const youtubeAudio = new YoutubeAudio();

(async function () {
    try {
        const { audio, buffer, headers, options } =
            await youtubeaudio.getAudioById(/ VideoId /, {
                outputFormat: "mp3",
            });
    } catch (error) {
        console.error(error);
    }
})();
```

## Proxy & Tor network support

```js
import YoutubeAudio from "yt-audio-dlp";

const youtubeAudio = new YoutubeAudio();

const { audio, buffer, headers, options } = await youtubeaudio.getAudioById(
    / VideoId /,
    {
        outputFormat: "webm",
        socks: "socks5://127.0.0.1:9050",
        proxy: {
            host: / host /,
            port: / port /
            auth: {
                username: / if required /,
                password: / if required /
            }
        }
    }
);
```

## Command-line usage

```
npm i -g yt-audio-dlp
```

```
yt-audio-dlp -u "https://www.youtube.com/watch?v=MfFbdLXAL9U" -f mp3
```

## Important!

This package requires installation ffmpeg -> https://www.ffmpeg.org/
