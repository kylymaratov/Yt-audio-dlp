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
exports.extractFunctions = exports.exctractAudioInfo = void 0;
const cheerio = __importStar(require("cheerio"));
const constants_1 = require("@/helpers/constants");
const regexp_1 = require("@/regexp/regexp");
const error_1 = __importDefault(require("./error"));
const desipher_1 = require("./desipher");
const vm_1 = __importDefault(require("vm"));
const fetcher_1 = require("./fetcher");
const regexp_2 = require("@/regexp/regexp");
const exctractAudioInfo = (htmlContent, scripts) => {
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
                throw new error_1.default("Many requests, login required", playerResponse.playabilityStatus.status);
            }
            if ((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status) !== "OK") {
                throw new error_1.default((playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.reason) ||
                    "Error while exctract palyer response", playerResponse === null || playerResponse === void 0 ? void 0 : playerResponse.playabilityStatus.status);
            }
        }
    });
    if (!playerResponse)
        throw new error_1.default("Incorrect HTML, video information not found", "INCORRECT_HTML");
    const formats = exctractFormats(playerResponse, scripts) || [];
    const details = playerResponse.videoDetails;
    return { details, formats };
};
exports.exctractAudioInfo = exctractAudioInfo;
const exctractFormats = (playerResponse, scripts) => {
    const formats = [];
    const streamingData = playerResponse.streamingData || {};
    try {
        constants_1.streamingDataFormats.forEach((dataType) => {
            streamingData[dataType].forEach((format) => {
                if (format) {
                    const decodedFormat = (0, desipher_1.desipherDownloadURL)(format, scripts.decipher, scripts.nTransform);
                    formats.push(decodedFormat);
                }
            });
        });
    }
    catch (_a) {
        return [];
    }
    return formats;
};
const matchRegex = (regex, str) => {
    const match = str.match(new RegExp(regex, "s"));
    if (!match)
        throw new Error(`Could not match ${regex}`);
    return match;
};
const matchFirst = (regex, str) => matchRegex(regex, str)[0];
const matchGroup1 = (regex, str) => matchRegex(regex, str)[1];
const getFuncName = (body, regexps) => {
    let fn;
    for (const regex of regexps) {
        try {
            fn = matchGroup1(regex, body);
            try {
                fn = matchGroup1(`${fn.replace(/\$/g, "\\$")}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
            }
            catch (_a) { }
            break;
        }
        catch (_b) {
            continue;
        }
    }
    if (!fn || fn.includes("["))
        throw new Error("Function name extraction failed");
    return fn;
};
const extractDecipherFunc = (body) => {
    try {
        const helperObject = matchFirst(regexp_2.HELPER_REGEXP, body);
        const decipherFunc = matchFirst(regexp_2.DECIPHER_REGEXP, body);
        const resultFunc = `var ${regexp_2.DECIPHER_FUNC_NAME}=${decipherFunc};`;
        const callerFunc = `${regexp_2.DECIPHER_FUNC_NAME}(${regexp_2.DECIPHER_ARGUMENT});`;
        return helperObject + resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractDecipherWithName = (body) => {
    try {
        const decipherFuncName = getFuncName(body, regexp_2.DECIPHER_NAME_REGEXPS);
        const funcPattern = `(${decipherFuncName.replace(/\$/g, "\\$")}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
        const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
        const helperObjectName = matchGroup1(";([A-Za-z0-9_\\$]{2,})\\.\\w+\\(", decipherFunc);
        const helperPattern = `(var ${helperObjectName.replace(/\$/g, "\\$")}=\\{[\\s\\S]+?\\}\\};)`;
        const helperObject = matchGroup1(helperPattern, body);
        const callerFunc = `${decipherFuncName}(${regexp_2.DECIPHER_ARGUMENT});`;
        return helperObject + decipherFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const getExtractFunctions = (extractFunctions, body) => {
    for (const extractFunction of extractFunctions) {
        try {
            const func = extractFunction(body);
            if (!func)
                continue;
            return new vm_1.default.Script(func);
        }
        catch (_a) {
            continue;
        }
    }
    return null;
};
const extractDecipher = (body) => {
    const decipherFunc = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
    return decipherFunc;
};
const extractNTransformFunc = (body) => {
    try {
        const nFunc = matchFirst(regexp_2.N_TRANSFORM_REGEXP, body);
        const resultFunc = `var ${regexp_2.N_TRANSFORM_FUNC_NAME}=${nFunc}`;
        const callerFunc = `${regexp_2.N_TRANSFORM_FUNC_NAME}(${regexp_2.N_ARGUMENT});`;
        return resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractNTransformWithName = (body) => {
    try {
        const nFuncName = getFuncName(body, regexp_2.N_TRANSFORM_NAME_REGEXPS);
        const funcPattern = `(${nFuncName.replace(/\$/g, "\\$")
        // eslint-disable-next-line max-len
        }=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`;
        const nTransformFunc = `var ${matchGroup1(funcPattern, body)};`;
        const callerFunc = `${nFuncName}(${regexp_2.N_ARGUMENT});`;
        return nTransformFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractNTransform = (body) => {
    const nTransformFunc = getExtractFunctions([extractNTransformFunc, extractNTransformWithName], body);
    return nTransformFunc;
};
const extractFunctions = (webData) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield (0, fetcher_1.fetchtHTML5Player)(webData);
    const decipher = extractDecipher(body);
    const nTransform = extractNTransform(body);
    return { decipher, nTransform };
});
exports.extractFunctions = extractFunctions;
