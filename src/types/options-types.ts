export interface TOptions {
    outputFormat?: TOutputFormats;
    socks?: string;
    proxy?: {
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        };
    };
}
export type OutputType = "stream" | "buffer";
export type TOutputFormats = "webm" | "mp3" | "wav" | "opus" | "ogg";

export enum TCodecs {
    webm = "libvorbis",
    mp3 = "libmp3lame",
    wav = "pcm_s16le",
    opus = "opus",
    ogg = "libvorbis",
}

export interface TResponseOptions {
    web: {
        userAgent: string;
        cookies: string;
    };
    android: {
        userAgent: string;
        cookies: string;
    };
}

export interface TTorOptions {
    host?: string;
    port?: number;
    password?: string;
}
