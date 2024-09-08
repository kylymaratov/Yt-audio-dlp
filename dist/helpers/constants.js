"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_TRY_COUNT = exports.defaultOptions = exports.youtubeUrls = exports.streamingDataFormats = void 0;
exports.streamingDataFormats = ["formats"];
exports.youtubeUrls = {
    base: "https://www.youtube.com",
    main: "https://www.youtube.com/watch?v=",
    mobile: "https://youtu.be/",
    androidPlayer: "https://youtubei.googleapis.com/youtubei/v1/player",
};
exports.defaultOptions = {
    outputFormat: "webm",
    proxy: undefined,
    socks: undefined,
};
exports.ALLOWED_TRY_COUNT = 3;
