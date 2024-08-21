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
require("./path-register");
const constants_1 = require("@/helpers/constants");
const check_regexp_1 = require("@/regexp/check-regexp");
const fetcher_1 = require("@/core/fetcher");
const exctractor_1 = require("@/core/exctractor");
const desipher_1 = require("@/core/desipher");
const options_1 = require("./core/options");
const tor_1 = __importDefault(require("./core/tor"));
class YoutubeDlp {
    constructor(options) {
        this.options = options || constants_1.defautlOptions;
    }
    getVideoById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, try_count = 0) {
            try {
                try_count++;
                if (!(0, check_regexp_1.checkVideoId)(id))
                    throw new Error("Invalid video id");
                const webData = yield (0, fetcher_1.fetchHtml)(constants_1.youtubeUrls.main + id, this.options);
                const video = (0, exctractor_1.exctractVideoInfo)(webData.htmlContent);
                const androidData = yield (0, fetcher_1.fetchAndroidJsonPlayer)(id, this.options);
                const scripts = yield (0, desipher_1.extractFunctions)(webData.htmlContent);
                video === null || video === void 0 ? void 0 : video.formats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
                video.adaptiveFormats = androidData.androidFormats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
                const validatedVideo = yield (0, options_1.validateByOptions)(video, this.options);
                return {
                    video: validatedVideo,
                    responseOptions: {
                        web: {
                            userAgent: webData.userAgent,
                            cookies: webData.cookies,
                        },
                        android: {
                            userAgent: androidData.userAgent,
                            cookies: androidData.cookies,
                        },
                    },
                };
            }
            catch (e) {
                if (e.stack === "LOGIN_REQUIRED" &&
                    this.options.torRequest &&
                    try_count <= constants_1.ALLOWED_TRY_COUNT) {
                    yield new tor_1.default().newNym();
                    return this.getVideoById(id);
                }
                throw e;
            }
        });
    }
    getVideoByHtml(htmlContent_1) {
        return __awaiter(this, arguments, void 0, function* (htmlContent, try_count = 5) {
            try {
                const video = (0, exctractor_1.exctractVideoInfo)(htmlContent);
                const scripts = yield (0, desipher_1.extractFunctions)(htmlContent);
                const androidData = yield (0, fetcher_1.fetchAndroidJsonPlayer)(video.videoDetails.videoId, this.options);
                video.formats.map((format) => {
                    return (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform);
                });
                video.adaptiveFormats = androidData.androidFormats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
                const validatedVideo = (0, options_1.validateByOptions)(video, this.options);
                return validatedVideo;
            }
            catch (e) {
                if (e.stack === "LOGIN_REQUIRED" &&
                    this.options.torRequest &&
                    try_count <= constants_1.ALLOWED_TRY_COUNT) {
                    yield new tor_1.default().newNym();
                    return this.getVideoByHtml(htmlContent);
                }
                throw e;
            }
        });
    }
    newTorNym() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new tor_1.default().newNym();
        });
    }
}
exports.default = YoutubeDlp;
