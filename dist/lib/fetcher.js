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
exports.fetchVideo = exports.fetchtHTML5Player = exports.fetchHtml = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("@/helpers/constants");
const regexp_1 = require("@/regexp/regexp");
const user_agent_1 = require("@/helpers/user-agent");
const stream_1 = require("stream");
const logs_1 = require("./logs");
const socks_proxy_agent_1 = require("socks-proxy-agent");
const fetchHtml = (id, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let socksProxy;
    const url = constants_1.youtubeUrls.main + id + "&sttick=0";
    if (options.socks) {
        (0, logs_1.customLog)(`Fetching html page: ${url} with socks ${options.socks} ...`);
        socksProxy = new socks_proxy_agent_1.SocksProxyAgent(options.socks);
        options.proxy = undefined;
    }
    else if (options.proxy) {
        options.socks = undefined;
        (0, logs_1.customLog)(`Fetching html page: ${url} with proxy ${options.proxy.host} ...`);
    }
    else {
        (0, logs_1.customLog)(`Fetching html page: ${url}...`);
    }
    const userAgent = (0, user_agent_1.getRandomUserAgent)();
    const headers = {
        "User-Agent": userAgent,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache, max-age=0",
        Origin: constants_1.youtubeUrls.main,
        Referer: url,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: "",
    };
    const response = yield axios_1.default.get(url, {
        headers,
        proxy: options.proxy,
        httpAgent: socksProxy,
        httpsAgent: socksProxy,
    });
    headers["Cookie"] = ((_a = response.headers["set-cookie"]) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    return {
        htmlContent: response.data,
        headers,
        socksProxy,
        proxy: options.proxy,
    };
});
exports.fetchHtml = fetchHtml;
const fetchtHTML5Player = (webData) => __awaiter(void 0, void 0, void 0, function* () {
    const html5PlayerRes = regexp_1.HTML5_PLAYER_REGEX.exec(webData.htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = constants_1.youtubeUrls.base + html5PlayerUrl;
    (0, logs_1.customLog)(`Fetching player js: ${requestUrl} ...`);
    const response = yield axios_1.default.get(requestUrl, {
        headers: webData.headers,
        proxy: webData.proxy,
        httpAgent: webData.socksProxy,
        httpsAgent: webData.socksProxy,
    });
    return response.data;
});
exports.fetchtHTML5Player = fetchtHTML5Player;
const fetchVideo = (format, headers) => __awaiter(void 0, void 0, void 0, function* () {
    (0, logs_1.customLog)(`Fetching data bytes ${format.mimeType}`);
    const response = yield axios_1.default.get(format.url, {
        headers,
        responseType: "arraybuffer",
        timeout: 60000,
    });
    return stream_1.Readable.from(response.data);
});
exports.fetchVideo = fetchVideo;
