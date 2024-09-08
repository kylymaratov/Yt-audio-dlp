import "./path-register";
import { TAudio } from "./types/audio";
import { Readable } from "stream";
import { TOptions } from "./types/options";
declare class YoutubeDlp {
    getAudioById(id: string, options?: TOptions): Promise<{
        audio: TAudio;
        stream: Readable;
        headers: any;
        options: TOptions;
    }>;
}
export default YoutubeDlp;
