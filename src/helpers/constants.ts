import { TOptions } from "@/types/options";

export const streamingDataFormats = ["formats"];

export const youtubeUrls = {
    base: "https://www.youtube.com",
    main: "https://www.youtube.com/watch?v=",
    mobile: "https://youtu.be/",
    androidPlayer: "https://youtubei.googleapis.com/youtubei/v1/player",
};

export const defaultOptions: TOptions = {
    outputFormat: "webm",
    proxy: undefined,
    socks: undefined,
};

export const ALLOWED_TRY_COUNT = 3;
