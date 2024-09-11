import { TOptions } from "@/types/options-types";

export const youtubeUrls = {
    main: "https://www.youtube.com",
    video: "https://www.youtube.com/watch?v=",
    shortLink: "https://youtu.be/",
    internalPlayer: "https://youtubei.googleapis.com/youtubei/v1/player",
};

export const defaultOptions: TOptions = {
    outputFormat: "webm",
    proxy: undefined,
    socks: undefined,
};
