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
exports.Youtube = void 0;
const check_regexp_1 = require("./regexp/check-regexp");
const fetcher_1 = require("./core/fetcher");
const exctractor_1 = require("./core/exctractor");
const stream_1 = require("./core/stream");
const logs_1 = require("./core/logs");
const constants_1 = require("@/helpers/constants");
class Youtube {
    getAudioById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, check_regexp_1.checkVideoId)(id))
                    throw new Error("Invalid video id");
                options = Object.assign(Object.assign({}, constants_1.defaultOptions), options);
                const webData = yield (0, fetcher_1.fetchHtml)(id, options);
                const scripts = yield (0, exctractor_1.extractFunctions)(webData);
                const audio = (0, exctractor_1.exctractAudioInfo)(webData.htmlContent, scripts);
                const stream = yield (0, stream_1.getAudioStream)(audio, webData.headers, options.outputFormat || "webm");
                return {
                    audio,
                    stream,
                    headers: webData.headers,
                    options,
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
exports.Youtube = Youtube;
exports.default = Youtube;
