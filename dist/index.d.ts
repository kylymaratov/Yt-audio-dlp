import "./path-register";
import ffmpeg from "fluent-ffmpeg";
import { TOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import { TAudioFormat } from "./types/format";
declare class YoutubeDlp {
    getVideoById(id: string, options?: TOptions): Promise<TVideo>;
    getAudioStreamById(id: string, format?: TAudioFormat): Promise<{
        video: TVideo;
        stream: ffmpeg.FfmpegCommand;
    }>;
    getAudioStreamByHtml(htmlContent: string, format?: TAudioFormat): Promise<{
        video: TVideo;
        stream: ffmpeg.FfmpegCommand;
    }>;
    getVideoByHtml(htmlContent: string, options?: TOptions): Promise<TVideo>;
}
export default YoutubeDlp;
