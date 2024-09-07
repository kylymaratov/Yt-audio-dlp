# Ytdl-audio 📹

This is a library for web scraping YouTube. With this library you can get direct links to download video audio from YouTube

## Installation

`npm install ytdl-audio`

## Usage

```
import YoutubeDlp from "ytdl-audio";

const ytdlAudio = new YtdlAudio();

ytdlAudio.getAudioById("lJIQrI15_c8")
.then(res => console.log(res))
.catch(err => console.log(err))
```

## API Response

```
{
  audio: {
    details: {
              videoId: string;
              title: string;
              lengthSeconds: string;
              keywords: string[];
              channelId: string;
              isOwnerViewing: boolean;
              shortDescription: string;
              isCrawlable: boolean;
              thumbnail: { thumbnails: {
                        url: string;
                        width: number;
                        height: number;
                }};
              allowRatings: boolean;
              viewCount: string;
              author: string;
              isPrivate: boolean;
              isUnpluggedCorpus: boolean;
              isLiveContent: boolean;
        };
        formats: [
          {
    itag: number;
    mimeType: string;
    bitrate: number;
    width: number;
    height: number;
    lastModified: string;
    quality: TQuality;
    initRange?: TRange;
    indexRange?: TRange;
    fps: number;
    qualityLabel: TQualityLabel;
    projectionType: string;
    audioQuality?: "AUDIO_QUALITY_MEDIUM" | "AUDIO_QUALITY_LOW";
    approxDurationMs: string;
    audioSampleRate: string;
    audioChannels: number;
    signatureCipher?: string;
    colorInfo?: TColorInfo;
    url: string;
    cipher?: string;
    ncode: string;
    sig: string;
          }
        ]
  }
  headers: / Headers /
  stream: / Audio stream /
}


```
