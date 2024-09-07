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
require("./path-register");
const check_regexp_1 = require("@/regexp/check-regexp");
const fetcher_1 = require("@/lib/fetcher");
const exctractor_1 = require("@/lib/exctractor");
const stream_1 = require("./lib/stream");
const logs_1 = require("./lib/logs");
class YoutubeDlp {
    getAudioById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, check_regexp_1.checkVideoId)(id))
                    throw new Error("Invalid video id");
                const webData = yield (0, fetcher_1.fetchHtml)(id);
                const scripts = yield (0, exctractor_1.extractFunctions)(webData);
                const audio = (0, exctractor_1.exctractAudioInfo)(webData.htmlContent, scripts);
                const stream = yield (0, stream_1.getAudioStream)({
                    audio,
                    headers: webData.headers,
                });
                return {
                    audio,
                    stream,
                    headers: webData.headers,
                };
            }
            catch (e) {
                throw e;
            }
            finally {
                (0, logs_1.clearCustomLogs)();
            }
        });
    }
}
exports.default = YoutubeDlp;
