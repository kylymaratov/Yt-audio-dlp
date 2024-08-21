export type TQuality = "medium" | "hd720" | "hd1080" | "large" | "small" | "tiny";
export type TQualityLabel = "1080p" | "1080p" | "720p" | "480p" | "360p" | "240p" | "144p";
export type TAudioFormat = "mp3" | "webm";
export interface TRange {
    start: string;
    end: string;
}
export interface TColorInfo {
    primaries: string;
    transferCharacteristics: string;
    matrixCoefficients: string;
}
export interface TFormat {
    itag: number;
    mimeType: string;
    bitrate: number;
    width: number;
    height: number;
    lastModified: string;
    quality: TQuality;
    initRange?: TRange;
    indexRange?: TRange;
    fps: number;
    qualityLabel: TQualityLabel;
    projectionType: string;
    audioQuality?: "AUDIO_QUALITY_MEDIUM" | "AUDIO_QUALITY_LOW";
    approxDurationMs: string;
    audioSampleRate: string;
    audioChannels: number;
    signatureCipher?: string;
    colorInfo?: TColorInfo;
    url: string;
    cipher?: string;
    ncode: string;
    sig: string;
}
