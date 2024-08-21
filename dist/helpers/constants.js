"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_TRY_COUNT = exports.ANDROID_SDK_VERSION = exports.ANDROID_OS_VERSION = exports.ANDROID_CLIENT_VERSION = exports.defautlOptions = exports.youtubeUrls = exports.streamingDataFormats = void 0;
exports.streamingDataFormats = ["formats"];
exports.youtubeUrls = {
    base: "https://www.youtube.com",
    main: "https://www.youtube.com/watch?v=",
    mobile: "https://youtu.be/",
    androidPlayer: "https://youtubei.googleapis.com/youtubei/v1/player",
};
exports.defautlOptions = {
    format: "all",
    checkWorkingLinks: false,
    torRequest: false,
};
exports.ANDROID_CLIENT_VERSION = "19.30.36", exports.ANDROID_OS_VERSION = "14", exports.ANDROID_SDK_VERSION = "34";
exports.ALLOWED_TRY_COUNT = 3;
