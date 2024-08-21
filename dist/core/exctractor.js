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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exctractExpireFromUrl = exports.exctractVideoInfo = void 0;
const cheerio = __importStar(require("cheerio"));
const constants_1 = require("@/helpers/constants");
const regexp_1 = require("@/regexp/regexp");
const error_1 = __importDefault(require("./error"));
const exctractVideoInfo = (htmlContent) => {
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
                throw new error_1.default("Failed while exctract andorid player", playerResponse.playabilityStatus.status);
            }
            if ((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status) !== "OK") {
                throw new error_1.default((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.reason) ||
                    "Error while exctract palyer response", playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status);
            }
        }
    });
    if (!playerResponse)
        throw new error_1.default("Incorrect HTML, video information not found", "INCORRECT_HTML");
    const formats = exctractFormats(playerResponse) || [];
    const videoDetails = playerResponse.videoDetails;
    return { videoDetails, formats, adaptiveFormats: [] };
};
exports.exctractVideoInfo = exctractVideoInfo;
const exctractFormats = (playerResponse) => {
    const formats = [];
    const streamingData = playerResponse.streamingData || {};
    try {
        constants_1.streamingDataFormats.forEach((dataType) => {
            streamingData[dataType].forEach((format) => {
                if (!format)
                    return;
                formats.push(format);
            });
        });
    }
    catch (_a) {
        return [];
    }
    return formats;
};
const exctractExpireFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        const expire = urlObj.searchParams.get("expire");
        if (!expire)
            return null;
        const expireTimestamp = parseInt(expire, 10);
        return expireTimestamp;
    }
    catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
};
exports.exctractExpireFromUrl = exctractExpireFromUrl;
