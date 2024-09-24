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
exports.YoutubeAudio = void 0;
require("./path-register");
const check_video_id_1 = require("./scripts/check-video-id");
const fetch_html_page_1 = require("./core/fetch-html-page");
const extract_video_info_1 = require("./core/extract-video-info");
const create_stream_1 = require("./utils/create-stream");
const lib_logger_1 = require(".//utils/lib-logger");
const constants_1 = require(".//constants/constants");
const extract_desipher_scripts_1 = require("./core/extract-desipher-scripts");
class YoutubeAudio {
    getAudioById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, check_video_id_1.checkVideoId)(id))
                    throw new Error("Invalid video id");
                options = Object.assign(Object.assign({}, constants_1.defaultOptions), options);
                const webData = yield (0, fetch_html_page_1.fetchHtmlPage)(id, options);
                const scripts = yield (0, extract_desipher_scripts_1.extractDesipherFunctions)(webData);
                const video = (0, extract_video_info_1.exctractVideoInfo)(webData.htmlContent, scripts);
                const buffer = yield (0, create_stream_1.createAudioStream)(video, webData.headers, options.outputFormat || "webm");
                return {
                    audio: video,
                    buffer,
                    headers: webData.headers,
                    options,
                };
            }
            catch (e) {
                throw e;
            }
            finally {
                (0, lib_logger_1.clearLogger)();
            }
        });
    }
}
exports.YoutubeAudio = YoutubeAudio;
exports.default = YoutubeAudio;
