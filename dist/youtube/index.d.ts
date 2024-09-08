import { TAudio } from "./types/audio";
import { Readable } from "stream";
import { TOptions } from "./types/options";
export declare class Youtube {
    getAudioById(id: string, options?: TOptions): Promise<{
        audio: TAudio;
        stream: Readable;
        headers: any;
        options: TOptions;
    }>;
}
export default Youtube;
