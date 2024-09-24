import "./path-register";
import { TAudio } from "./types/audio-types";
import { TOptions } from "./types/options-types";
export declare class YoutubeAudio {
    getAudioById(id: string, options?: TOptions): Promise<{
        audio: TAudio;
        buffer: Buffer;
        headers: any;
    }>;
}
export default YoutubeAudio;
