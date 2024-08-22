import "./path-register";
import { TOptions, TResponseOptions, TTorOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import TorControl from "./core/tor";
declare class YoutubeDlp {
    private options;
    tor: TorControl | null;
    constructor(options?: TOptions, torOptions?: TTorOptions);
    getVideoById(id: string, try_count?: number): Promise<{
        video: TVideo;
        responseOptions: TResponseOptions;
    }>;
    getVideoByHtml(htmlContent: string, try_count?: number): Promise<TVideo>;
}
export default YoutubeDlp;
