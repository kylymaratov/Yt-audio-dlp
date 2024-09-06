import { Readable } from "stream";
import { TAudio } from "@/types/audio";
declare function getAudioStream({ audio, headers, }: {
    audio: TAudio;
    headers: any;
}): Promise<Readable>;
export { getAudioStream };
