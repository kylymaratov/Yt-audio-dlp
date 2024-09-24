import { TAudio } from "@/types/audio-types";
import { TOutputFormats } from "@/types/options-types";
declare function createAudioStream(audio: TAudio, headers: any, outputFormat: TOutputFormats): Promise<Buffer>;
export { createAudioStream };
