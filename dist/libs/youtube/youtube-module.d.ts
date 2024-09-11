import { Readable } from "stream";
import { TAudio } from "../../types/audio-types";
import { TOptions } from "../../types/options-types";
export declare class Youtube {
    getAudioById(id: string, options?: TOptions): Promise<{
        audio: TAudio;
        stream: Readable;
        headers: any;
        options: TOptions;
    }>;
}
export default Youtube;
