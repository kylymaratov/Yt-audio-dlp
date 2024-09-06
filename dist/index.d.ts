import "./path-register";
import { TAudio } from "./types/audio";
import { Readable } from "stream";
declare class YoutubeDlp {
    getAudioById(id: string): Promise<{
        audio: TAudio;
        stream: Readable;
        headers: any;
    }>;
}
export default YoutubeDlp;
