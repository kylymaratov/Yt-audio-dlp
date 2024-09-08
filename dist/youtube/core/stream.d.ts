import { Readable } from "stream";
import { TAudio } from "@/youtube/types/audio";
import { TOutputFormats } from "@/youtube/types/options";
declare function getAudioStream(audio: TAudio, headers: any, outputFormat: TOutputFormats): Promise<Readable>;
export { getAudioStream };
