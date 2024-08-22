"use strict";
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
exports.fetchAndroidJsonPlayer = exports.fetchtHTML5Player = exports.fetchHtml = void 0;
const axios_1 = __importDefault(require("axios"));
const socks_proxy_agent_1 = require("socks-proxy-agent");
//
const constants_1 = require("@/helpers/constants");
const regexp_1 = require("@/regexp/regexp");
const utils_1 = require("@/helpers/utils");
const error_1 = __importDefault(require("./error"));
const user_agent_1 = require("@/helpers/user-agent");
const fetchHtml = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let socksAgent = null;
    console.info(`Fetching html page: ${url}`);
    if (options.torRequest) {
        socksAgent = new socks_proxy_agent_1.SocksProxyAgent("socks5://127.0.0.1:9050");
        console.log(`Tor proxy ${socksAgent.proxy.host}:${socksAgent.proxy.port}`);
    }
    const userAgent = (0, user_agent_1.getRandomUserAgent)();
    const response = yield axios_1.default.get(url, {
        httpAgent: options.torRequest ? socksAgent : null,
        httpsAgent: options.torRequest ? socksAgent : null,
        headers: {
            "User-Agent": userAgent,
        },
    });
    return {
        htmlContent: response.data,
        userAgent: userAgent,
        cookies: ((_a = response.headers["set-cookie"]) === null || _a === void 0 ? void 0 : _a.toString()) || "",
    };
});
exports.fetchHtml = fetchHtml;
const fetchtHTML5Player = (htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    const html5PlayerRes = regexp_1.HTML5_PLAYER_REGEX.exec(htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = constants_1.youtubeUrls.base + html5PlayerUrl;
    console.info(`Fetching player js: ${requestUrl}`);
    const response = yield axios_1.default.get(requestUrl);
    return response.data;
});
exports.fetchtHTML5Player = fetchtHTML5Player;
const fetchAndroidJsonPlayer = (videoId, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const socksAgent = new socks_proxy_agent_1.SocksProxyAgent("socks5://127.0.0.1:9050");
        const { userAgent } = (0, user_agent_1.getRandomYouTubeUserAgent)();
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
                "User-Agent": userAgent,
                "X-Goog-Api-Format-Version": "2",
            },
            data: JSON.stringify(payload),
        };
        console.info(`Fetching android player: ${constants_1.youtubeUrls.androidPlayer}`);
        if (options.torRequest) {
            console.log(`Tor proxy ${socksAgent.proxy.host}:${socksAgent.proxy.port}`);
        }
        const response = yield (0, axios_1.default)(constants_1.youtubeUrls.androidPlayer, Object.assign(Object.assign({}, config), { httpAgent: options.torRequest ? socksAgent : null, httpsAgent: options.torRequest ? socksAgent : null }));
        if (response.data.playabilityStatus.status === "LOGIN_REQUIRED") {
            throw new error_1.default("Failed while exctract andorid player", response.data.playabilityStatus.status);
        }
        if (response.data.playabilityStatus.status !== "OK") {
            console.info(`Failed fetch andorid player`);
            throw new error_1.default("Failed fetch andorid player");
        }
        return {
            androidFormats: response.data.streamingData.adaptiveFormats,
            userAgent,
            cookies: ((_a = response.headers["set-cookie"]) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        };
    }
    catch (e) {
        return {
            androidFormats: [],
            userAgent: "",
            cookies: "",
        };
    }
});
exports.fetchAndroidJsonPlayer = fetchAndroidJsonPlayer;
