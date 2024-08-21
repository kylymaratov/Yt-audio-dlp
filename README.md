# Youtube-dlp

This is a library for web scraping YouTube. With this library you can get direct links to download video audio from YouTube

## Installation

`npm install --save youtube-dlp`

## Usage

```
import YoutubeDlp from "youtube-dlp";

/* Youtube-dl input options */
const youtubeDlOptions = {
    checkWorkingLinks: true,
    cookies: "",
    format: "all",
    userAgent: "",
    torRequest: false
}

const youtubeDlp = new YoutubeDlp(youtubeDlOptions);

youtubeDlp.getVideoById("lJIQrI15_c8")
.then(res => console.log(res))
.catch(err => console.log(err))
```

To prevent YouTube from blocking you for frequent requests, it is recommended to enable TorRequest to make requests via the Tor network.
