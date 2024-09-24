"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N_TRANSFORM_REGEXP = exports.DECIPHER_REGEXP = exports.HELPER_REGEXP = exports.N_TRANSFORM_NAME_REGEXPS = exports.AAR = exports.FNR = exports.SCVR = exports.DECIPHER_NAME_REGEXPS = exports.SWAP_PART = exports.SPLICE_PART = exports.SLICE_PART = exports.REVERSE_PART = exports.VARIABLE_PART_ACCESS = exports.AFTER_ACCESS = exports.BEFORE_ACCESS = exports.VARIABLE_PART_DEFINE = exports.VARIABLE_PART = exports.N_ARGUMENT = exports.DECIPHER_ARGUMENT = exports.N_TRANSFORM_FUNC_NAME = exports.DECIPHER_FUNC_NAME = exports.HTML5_PLAYER_REGEX = exports.VIDEO_ID_REGEXP = exports.HTML_PAGE_SCRIPT_REGEX = void 0;
exports.HTML_PAGE_SCRIPT_REGEX = /ytInitialPlayerResponse\s*=\s*({.*?});/;
exports.VIDEO_ID_REGEXP = /^[a-zA-Z0-9-_]{11}$/;
exports.HTML5_PLAYER_REGEX = /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/;
exports.DECIPHER_FUNC_NAME = "DisTubeDecipherFunc";
exports.N_TRANSFORM_FUNC_NAME = "DisTubeNTransformFunc";
exports.DECIPHER_ARGUMENT = "sig";
exports.N_ARGUMENT = "ncode";
exports.VARIABLE_PART = "[a-zA-Z_\\$][a-zA-Z_0-9]*";
exports.VARIABLE_PART_DEFINE = `\\"?${exports.VARIABLE_PART}\\"?`;
exports.BEFORE_ACCESS = '(?:\\[\\"|\\.)';
exports.AFTER_ACCESS = '(?:\\"\\]|)';
exports.VARIABLE_PART_ACCESS = exports.BEFORE_ACCESS + exports.VARIABLE_PART + exports.AFTER_ACCESS;
exports.REVERSE_PART = ":function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}";
exports.SLICE_PART = ":function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}";
exports.SPLICE_PART = ":function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}";
exports.SWAP_PART = ":function\\(a,b\\)\\{" +
    "var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}";
exports.DECIPHER_NAME_REGEXPS = [
    "\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)",
    "\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)",
    '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
    '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];
exports.SCVR = "[a-zA-Z0-9$_]";
exports.FNR = `${exports.SCVR}+`;
exports.AAR = "\\[(\\d+)]";
exports.N_TRANSFORM_NAME_REGEXPS = [
    `${exports.SCVR}+="nn"\\[\\+${exports.SCVR}+\\.${exports.SCVR}+],${exports.SCVR}+=${exports.SCVR}+\\.get\\(${exports.SCVR}+\\)\\)&&\\(${exports.SCVR}+=(${exports.SCVR}+)\\[(\\d+)]`,
    `${exports.SCVR}+="nn"\\[\\+${exports.SCVR}+\\.${exports.SCVR}+],${exports.SCVR}+=${exports.SCVR}+\\.get\\(${exports.SCVR}+\\)\\).+\\|\\|(${exports.SCVR}+)\\(""\\)`,
    `\\(${exports.SCVR}=String\\.fromCharCode\\(110\\),${exports.SCVR}=${exports.SCVR}\\.get\\(${exports.SCVR}\\)\\)&&\\(${exports.SCVR}=(${exports.FNR})(?:${exports.AAR})?\\(${exports.SCVR}\\)`,
    `\\.get\\("n"\\)\\)&&\\(${exports.SCVR}=(${exports.FNR})(?:${exports.AAR})?\\(${exports.SCVR}\\)`,
    // Skick regexps
    '(\\w+).length\\|\\|\\w+\\(""\\)',
    '\\w+.length\\|\\|(\\w+)\\(""\\)',
];
exports.HELPER_REGEXP = `var (${exports.VARIABLE_PART})=\\{((?:(?:${exports.VARIABLE_PART_DEFINE}${exports.REVERSE_PART}|${exports.VARIABLE_PART_DEFINE}${exports.SLICE_PART}|${exports.VARIABLE_PART_DEFINE}${exports.SPLICE_PART}|${exports.VARIABLE_PART_DEFINE}${exports.SWAP_PART}),?\\n?)+)\\};`;
exports.DECIPHER_REGEXP = `function(?: ${exports.VARIABLE_PART})?\\(a\\)\\{` +
    `a=a\\.split\\(""\\);\\s*` +
    `((?:(?:a=)?${exports.VARIABLE_PART}${exports.VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
    `return a\\.join\\(""\\)` +
    `\\}`;
exports.N_TRANSFORM_REGEXP = "function\\(\\s*(\\w+)\\s*\\)\\s*\\{" +
    'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
    "\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]" +
    "(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\" +
    '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
    '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';
