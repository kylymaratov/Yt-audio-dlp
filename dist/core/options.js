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
exports.validateByOptions = void 0;
const axios_1 = __importDefault(require("axios"));
const validateByOptions = (video, opt) => __awaiter(void 0, void 0, void 0, function* () {
    if (opt.format === "audio") {
        video.adaptiveFormats = video === null || video === void 0 ? void 0 : video.adaptiveFormats.filter((f) => f.mimeType.includes("audio/"));
    }
    if (opt.format === "video") {
        video.adaptiveFormats = video === null || video === void 0 ? void 0 : video.adaptiveFormats.filter((f) => f.mimeType.includes("video/"));
    }
    if (opt.checkWorkingLinks) {
        const work_formats = [];
        for (let f of video.adaptiveFormats) {
            try {
                if (!f.url)
                    continue;
                yield axios_1.default.head(f.url, { timeout: 5000 });
                work_formats.push(f);
            }
            catch (e) {
                continue;
            }
        }
        video.adaptiveFormats = work_formats;
    }
    return video;
});
exports.validateByOptions = validateByOptions;
