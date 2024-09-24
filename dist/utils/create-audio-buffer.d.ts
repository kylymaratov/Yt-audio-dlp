import { TAudio } from "@/types/audio-types";
import { TOptions } from "@/types/options-types";
declare function createAudioBuffer(audio: TAudio, headers: any, options: TOptions): Promise<Buffer>;
export { createAudioBuffer };
