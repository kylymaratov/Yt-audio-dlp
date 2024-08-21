import "./path-register";
import { TOptions, TResponseOptions } from "./types/options";
import { TVideo } from "./types/video-details";
declare class YoutubeDlp {
    private options;
    constructor(options?: TOptions);
    getVideoById(id: string, try_count?: number): Promise<{
        video: TVideo;
        responseOptions: TResponseOptions;
    }>;
    getVideoByHtml(htmlContent: string, try_count?: number): Promise<TVideo>;
    newTorNym(): Promise<void>;
}
export default YoutubeDlp;
