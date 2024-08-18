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
exports.setDownloadURL = exports.extractFunctions = void 0;
const vm_1 = __importDefault(require("vm"));
const querystring_1 = __importDefault(require("querystring"));
const downloader_1 = require("./downloader");
const DECIPHER_FUNC_NAME = 'DisTubeDecipherFunc';
const N_TRANSFORM_FUNC_NAME = 'DisTubeNTransformFunc';
const DECIPHER_ARGUMENT = 'sig';
const N_ARGUMENT = 'ncode';
const VARIABLE_PART = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
const AFTER_ACCESS = '(?:\\"\\]|)';
const VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
const REVERSE_PART = ':function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}';
const SLICE_PART = ':function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}';
const SPLICE_PART = ':function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}';
const SWAP_PART = ':function\\(a,b\\)\\{' +
    'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}';
const DECIPHER_NAME_REGEXPS = [
    '\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)',
    '\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)',
    '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
    '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];
const SCVR = '[a-zA-Z0-9$_]';
const FNR = `${SCVR}+`;
const AAR = '\\[(\\d+)]';
const N_TRANSFORM_NAME_REGEXPS = [
    `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\)&&\\(${SCVR}+=(${SCVR}+)\\[(\\d+)]`,
    `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${SCVR}+\\)\\).+\\|\\|(${SCVR}+)\\(""\\)`,
    `\\(${SCVR}=String\\.fromCharCode\\(110\\),${SCVR}=${SCVR}\\.get\\(${SCVR}\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
    `\\.get\\("n"\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
    // Skick regexps
    '(\\w+).length\\|\\|\\w+\\(""\\)',
    '\\w+.length\\|\\|(\\w+)\\(""\\)',
];
const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${VARIABLE_PART_DEFINE}${REVERSE_PART}|${VARIABLE_PART_DEFINE}${SLICE_PART}|${VARIABLE_PART_DEFINE}${SPLICE_PART}|${VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;
const DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
    `a=a\\.split\\(""\\);\\s*` +
    `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
    `return a\\.join\\(""\\)` +
    `\\}`;
const N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{' +
    'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
    '\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]' +
    '(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\' +
    '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
    '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';
const matchRegex = (regex, str) => {
    const match = str.match(new RegExp(regex, 's'));
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
                fn = matchGroup1(`${fn.replace(/\$/g, '\\$')}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
            }
            catch (_a) { }
            break;
        }
        catch (_b) {
            continue;
        }
    }
    if (!fn || fn.includes('['))
        throw new Error('Function name extraction failed');
    return fn;
};
const extractDecipherFunc = (body) => {
    try {
        const helperObject = matchFirst(HELPER_REGEXP, body);
        const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
        const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
        const callerFunc = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return helperObject + resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractDecipherWithName = (body) => {
    try {
        const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
        const funcPattern = `(${decipherFuncName.replace(/\$/g, '\\$')}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
        const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
        const helperObjectName = matchGroup1(';([A-Za-z0-9_\\$]{2,})\\.\\w+\\(', decipherFunc);
        const helperPattern = `(var ${helperObjectName.replace(/\$/g, '\\$')}=\\{[\\s\\S]+?\\}\\};)`;
        const helperObject = matchGroup1(helperPattern, body);
        const callerFunc = `${decipherFuncName}(${DECIPHER_ARGUMENT});`;
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
        const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
        const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
        const callerFunc = `${N_TRANSFORM_FUNC_NAME}(${N_ARGUMENT});`;
        return resultFunc + callerFunc;
    }
    catch (_a) {
        return null;
    }
};
const extractNTransformWithName = (body) => {
    try {
        const nFuncName = getFuncName(body, N_TRANSFORM_NAME_REGEXPS);
        const funcPattern = `(${nFuncName.replace(/\$/g, '\\$')
        // eslint-disable-next-line max-len
        }=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`;
        const nTransformFunc = `var ${matchGroup1(funcPattern, body)};`;
        const callerFunc = `${nFuncName}(${N_ARGUMENT});`;
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
    const body = yield (0, downloader_1.getHTML5Player)(htmlContent);
    const decipher = extractDecipher(body);
    const nTransform = extractNTransform(body);
    return { decipher, nTransform };
});
exports.extractFunctions = extractFunctions;
const setDownloadURL = (format, decipherScript, nTransformScript) => {
    if (!decipherScript)
        return;
    const decipher = (url) => {
        const args = querystring_1.default.parse(url);
        if (!args.s)
            return args.url;
        const components = new URL(decodeURIComponent(args.url));
        const context = {};
        context[DECIPHER_ARGUMENT] = decodeURIComponent(args.s);
        components.searchParams.set('sig', decipherScript.runInNewContext(context));
        return components.toString();
    };
    const nTransform = (url) => {
        const components = new URL(decodeURIComponent(url));
        const n = components.searchParams.get('n');
        if (!n || !nTransformScript)
            return url;
        const context = {};
        context[N_ARGUMENT] = n;
        components.searchParams.set('n', nTransformScript.runInNewContext(context));
        return components.toString();
    };
    const isCipher = !format.url;
    const url = format.url || format.signatureCipher || format.cipher || format.signature || "";
    const formatedUrl = nTransform(isCipher ? decipher(url) : url);
    format.url = formatedUrl;
    delete format.cipher;
    delete format.signatureCipher;
    delete format.signature;
    return format;
};
exports.setDownloadURL = setDownloadURL;
