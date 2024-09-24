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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exctractVideoInfo = void 0;
const cheerio = __importStar(require("cheerio"));
const throw_error_1 = require("@/utils/throw-error");
const regexp_1 = require("@/regexp");
const desipher_video_urls_1 = require("./desipher-video-urls");
const exctractVideoInfo = (htmlContent, scripts) => {
    const $ = cheerio.load(htmlContent);
    const scriptTags = $("script");
    let playerResponse = null;
    scriptTags.each((_, scriptTag) => {
        const scriptContent = $(scriptTag).html();
        if (scriptContent) {
            const match = scriptContent.match(regexp_1.HTML_PAGE_SCRIPT_REGEX);
            if (!match)
                return;
            playerResponse = JSON.parse(match[1]);
            if ((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status) === "LOGIN_REQUIRED") {
                throw new throw_error_1.ErrorModule("Many requests, login required", playerResponse.playabilityStatus.status);
            }
            if ((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status) !== "OK") {
                throw new throw_error_1.ErrorModule((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.reason) ||
                    "Error while exctract palyer response", playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status);
            }
        }
    });
    if (!playerResponse)
        throw new throw_error_1.ErrorModule("Incorrect HTML, video information not found", "INCORRECT_HTML");
    const formats = exctractVideoFormats(playerResponse, scripts) || [];
    const details = playerResponse.videoDetails;
    return { details, formats };
};
exports.exctractVideoInfo = exctractVideoInfo;
function exctractVideoFormats(playerResponse, scripts) {
    const formats = [];
    const streamingData = playerResponse.streamingData || {};
    try {
        ["formats"].forEach((dataType) => {
            streamingData[dataType].forEach((format) => {
                if (format) {
                    const decodedFormat = (0, desipher_video_urls_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform);
                    formats.push(decodedFormat);
                }
            });
        });
    }
    catch (_a) {
        return [];
    }
    return formats;
}
