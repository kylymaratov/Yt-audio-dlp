import { AxiosRequestConfig } from "axios";
import ffmpeg from "fluent-ffmpeg";
import { TAudioFormat, TFormat } from "../types/format";
export declare const fetchHtml: (url: string, options?: AxiosRequestConfig) => Promise<any>;
export declare const fetchtHTML5Player: (htmlContent: string) => Promise<any>;
export declare const fetchAudioStream: (url: string, format: TAudioFormat) => Promise<ffmpeg.FfmpegCommand>;
export declare const fetchAndroidJsonPlayer: (videoId: string) => Promise<TFormat[]>;
