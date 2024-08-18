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
exports.desipherDownloadURL = exports.extractFunctions = void 0;
const vm_1 = __importDefault(require("vm"));
const querystring_1 = __importDefault(require("querystring"));
const downloader_1 = require("./downloader");
const regexp_1 = require("@/regexp/regexp");
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
        const helperObject = matchFirst(regexp_1.HELPER_REGEXP, body);
        const decipherFunc = matchFirst(regexp_1.DECIPHER_REGEXP, body);
        const resultFunc = `var ${regexp_1.DECIPHER_FUNC_NAME}=${decipherFunc};`;
        const callerFunc = `${regexp_1.DECIPHER_FUNC_NAME}(${regexp_1.DECIPHER_ARGUMENT});`;
        return helperObject + resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractDecipherWithName = (body) => {
    try {
        const decipherFuncName = getFuncName(body, regexp_1.DECIPHER_NAME_REGEXPS);
        const funcPattern = `(${decipherFuncName.replace(/\$/g, "\\$")}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
        const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
        const helperObjectName = matchGroup1(";([A-Za-z0-9_\\$]{2,})\\.\\w+\\(", decipherFunc);
        const helperPattern = `(var ${helperObjectName.replace(/\$/g, "\\$")}=\\{[\\s\\S]+?\\}\\};)`;
        const helperObject = matchGroup1(helperPattern, body);
        const callerFunc = `${decipherFuncName}(${regexp_1.DECIPHER_ARGUMENT});`;
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
        const nFunc = matchFirst(regexp_1.N_TRANSFORM_REGEXP, body);
        const resultFunc = `var ${regexp_1.N_TRANSFORM_FUNC_NAME}=${nFunc}`;
        const callerFunc = `${regexp_1.N_TRANSFORM_FUNC_NAME}(${regexp_1.N_ARGUMENT});`;
        return resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractNTransformWithName = (body) => {
    try {
        const nFuncName = getFuncName(body, regexp_1.N_TRANSFORM_NAME_REGEXPS);
        const funcPattern = `(${nFuncName.replace(/\$/g, "\\$")
        // eslint-disable-next-line max-len
        }=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`;
        const nTransformFunc = `var ${matchGroup1(funcPattern, body)};`;
        const callerFunc = `${nFuncName}(${regexp_1.N_ARGUMENT});`;
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
const extractFunctions = (htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield (0, downloader_1.fetchtHTML5Player)(htmlContent);
    const decipher = extractDecipher(body);
    const nTransform = extractNTransform(body);
    return { decipher, nTransform };
});
exports.extractFunctions = extractFunctions;
const desipherDownloadURL = (format, decipherScript, nTransformScript) => {
    const decipher = (url) => {
        if (!decipherScript)
            return url;
        const args = querystring_1.default.parse(url);
        if (!args.s)
            return args.url;
        const components = new URL(decodeURIComponent(args.url));
        const context = {};
        context[regexp_1.DECIPHER_ARGUMENT] = decodeURIComponent(args.s);
        const sig = decipherScript.runInNewContext(context);
        components.searchParams.set("sig", sig);
        return components.toString();
    };
    const nTransform = (url) => {
        const components = new URL(decodeURIComponent(url));
        const n = components.searchParams.get("n");
        if (!n || !nTransformScript)
            return url;
        const context = {};
        context[regexp_1.N_ARGUMENT] = n;
        const ncode = nTransformScript.runInNewContext(context);
        components.searchParams.set("n", ncode);
        return components.toString();
    };
    const isCipher = !format.url;
    const url = format.signatureCipher || format.url || format.cipher || "";
    format.url = nTransform(isCipher ? decipher(url) : url);
    delete format.cipher;
    delete format.signatureCipher;
    return format;
};
exports.desipherDownloadURL = desipherDownloadURL;
