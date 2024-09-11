export type TAudioFormat = "mp3" | "webm";
export interface TRange {
    start: string;
    end: string;
}
export interface TFormat {
    itag: number;
    mimeType: string;
    bitrate: number;
    width: number;
    height: number;
    lastModified: string;
    initRange?: TRange;
    indexRange?: TRange;
    fps: number;
    projectionType: string;
    audioQuality?: "AUDIO_QUALITY_MEDIUM" | "AUDIO_QUALITY_LOW";
    approxDurationMs: string;
    audioSampleRate: string;
    audioChannels: number;
    signatureCipher?: string;
    url: string;
    cipher?: string;
    ncode: string;
    sig: string;
}
