"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndroidJsonPlayer = exports.fetchAudioStream = exports.fetchtHTML5Player = exports.fetchHtml = void 0;
const constants_1 = require("@/helpers/constants");
const regexp_1 = require("@/regexp/regexp");
const axios_1 = __importDefault(require("axios"));
const http = __importStar(require("https"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const utils_1 = require("@/helpers/utils");
const fetchHtml = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, options = {}) {
    const response = yield axios_1.default.get(url, options);
    console.log(`Fetching html page: ${url}`);
    if (response.status !== 200)
        throw new Error(`The server responded with code: ${response.status}`);
    return response.data;
});
exports.fetchHtml = fetchHtml;
const fetchtHTML5Player = (htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    const html5PlayerRes = regexp_1.HTML5_PLAYER_REGEX.exec(htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = constants_1.youtubeUrls.base + html5PlayerUrl;
    console.info(`Fething player js: ${requestUrl}`);
    const response = yield axios_1.default.get(requestUrl);
    if (response.status !== 200)
        throw new Error(`The server responded with code: ${response.status}`);
    return response.data;
});
exports.fetchtHTML5Player = fetchtHTML5Player;
const fetchAudioStream = (url, format) => {
    return new Promise((res, rej) => {
        http.get(url, (response) => {
            const stream = (0, fluent_ffmpeg_1.default)()
                .input(response)
                .noVideo()
                .audioCodec(format === "mp3" ? "libmp3lame" : "libopus")
                .format(format);
            response.on("error", (err) => {
                rej(err);
            });
            stream.on("error", (err) => rej(err));
            res(stream);
        });
    });
};
exports.fetchAudioStream = fetchAudioStream;
const fetchAndroidJsonPlayer = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            videoId,
            cpn: (0, utils_1.generateClientPlaybackNonce)(16),
            contentCheckOk: true,
            racyCheckOk: true,
            context: {
                client: {
                    clientName: "ANDROID",
                    clientVersion: constants_1.ANDROID_CLIENT_VERSION,
                    platform: "MOBILE",
                    osName: "Android",
                    osVersion: constants_1.ANDROID_OS_VERSION,
                    androidSdkVersion: constants_1.ANDROID_SDK_VERSION,
                    hl: "en",
                    gl: "US",
                    utcOffsetMinutes: -240,
                },
                request: {
                    internalExperimentFlags: [],
                    useSsl: true,
                },
                user: {
                    lockedSafetyMode: false,
                },
            },
        };
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `com.google.android.youtube/${constants_1.ANDROID_CLIENT_VERSION} (Linux; U; Android ${constants_1.ANDROID_OS_VERSION}; en_US) gzip`,
                "X-Goog-Api-Format-Version": "2",
            },
            data: JSON.stringify(payload),
        };
        const response = yield (0, axios_1.default)("https://youtubei.googleapis.com/youtubei/v1/player", config);
        return response.data.streamingData.adaptiveFormats;
    }
    catch (e) {
        return [];
    }
});
exports.fetchAndroidJsonPlayer = fetchAndroidJsonPlayer;
