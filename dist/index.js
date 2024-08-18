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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoByHtml = exports.getAudioStreamByHtml = exports.getAudioStreamById = exports.getVideoById = void 0;
require("./path-register");
const constants_1 = require("@/helpers/constants");
const check_regexp_1 = require("@/regexp/check-regexp");
const downloader_1 = require("@/core/downloader");
const exctractor_1 = require("./core/exctractor");
const desipher_1 = require("./core/desipher");
const options_1 = require("./core/options");
const getVideoById = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, options = constants_1.defautlOptions) {
    try {
        if (!(0, check_regexp_1.checkVideoId)(id))
            throw new Error("Invalid video id");
        const htmlContent = yield (0, downloader_1.fetchHtml)(constants_1.youtubeUrls.main + id);
        const video = (0, exctractor_1.exctractVideoInfo)(htmlContent);
        const adaptiveFormats = yield (0, downloader_1.fetchAndroidJsonPlayer)(id);
        const scripts = yield (0, desipher_1.extractFunctions)(htmlContent);
        video === null || video === void 0 ? void 0 : video.formats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
        video.adaptiveFormats = adaptiveFormats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
        return yield (0, options_1.validateByOptions)(video, options);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
exports.getVideoById = getVideoById;
const getAudioStreamById = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, format = "mp3") {
    try {
        if (!(0, check_regexp_1.checkVideoId)(id))
            throw new Error("Invalid video id");
        const video = yield (0, exports.getVideoById)(id);
        const stream = yield (0, downloader_1.fetchAudioStream)(video.formats[0].url || "", format);
        return { video, stream };
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
exports.getAudioStreamById = getAudioStreamById;
const getAudioStreamByHtml = (htmlContent_1, ...args_1) => __awaiter(void 0, [htmlContent_1, ...args_1], void 0, function* (htmlContent, format = "mp3") {
    try {
        const video = yield (0, exports.getVideoByHtml)(htmlContent);
        const stream = yield (0, downloader_1.fetchAudioStream)(video.formats[0].url, format);
        return { video, stream };
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
exports.getAudioStreamByHtml = getAudioStreamByHtml;
const getVideoByHtml = (htmlContent_1, ...args_1) => __awaiter(void 0, [htmlContent_1, ...args_1], void 0, function* (htmlContent, options = constants_1.defautlOptions) {
    try {
        const video = (0, exctractor_1.exctractVideoInfo)(htmlContent);
        const scripts = yield (0, desipher_1.extractFunctions)(htmlContent);
        const adaptiveFormats = yield (0, downloader_1.fetchAndroidJsonPlayer)(video.videoDetails.videoId);
        video.formats.map((format) => {
            return (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform);
        });
        video.adaptiveFormats = adaptiveFormats.map((format) => (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform));
        return yield (0, options_1.validateByOptions)(video, options);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
exports.getVideoByHtml = getVideoByHtml;
(0, exports.getVideoById)("hl7_pm4lnP0").then((res) => console.log(res));
