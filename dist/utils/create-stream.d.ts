import { Readable } from "stream";
import { TAudio } from "@/types/audio-types";
import { TOutputFormats } from "@/types/options-types";
declare function getAudioStream(audio: TAudio, headers: any, outputFormat: TOutputFormats): Promise<Readable>;
export { getAudioStream };
