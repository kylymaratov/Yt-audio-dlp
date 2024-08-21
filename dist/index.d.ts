import "./path-register";
import { TOptions, TResponseOptions } from "./types/options";
import { TVideo } from "./types/video-details";
declare class YoutubeDlp {
    getVideoById(id: string, options?: TOptions, try_count?: number): Promise<{
        video: TVideo;
        responseOptions: TResponseOptions;
    }>;
    getVideoByHtml(htmlContent: string, options?: TOptions, try_count?: number): Promise<TVideo>;
    newTorNym(): Promise<void>;
}
export default YoutubeDlp;
