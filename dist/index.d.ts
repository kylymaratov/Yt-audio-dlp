import "./path-register";
import { TVideo } from "@/types/video-details";
import { TOptions } from "@/types/options";
import ffmpeg from "fluent-ffmpeg";
import { TAudioFormat } from "@/types/format";
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
