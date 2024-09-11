export const HTML_PAGE_SCRIPT_REGEX = /ytInitialPlayerResponse\s*=\s*({.*?});/;
export const VIDEO_ID_REGEXP = /^[a-zA-Z0-9-_]{11}$/;
export const HTML5_PLAYER_REGEX =
    /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/;

export const DECIPHER_FUNC_NAME = "DisTubeDecipherFunc";
export const N_TRANSFORM_FUNC_NAME = "DisTubeNTransformFunc";
export const DECIPHER_ARGUMENT = "sig";
export const N_ARGUMENT = "ncode";

export const VARIABLE_PART = "[a-zA-Z_\\$][a-zA-Z_0-9]*";
export const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
export const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
export const AFTER_ACCESS = '(?:\\"\\]|)';
export const VARIABLE_PART_ACCESS =
    BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
export const REVERSE_PART =
    ":function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}";
export const SLICE_PART = ":function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}";
export const SPLICE_PART = ":function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}";
export const SWAP_PART =
    ":function\\(a,b\\)\\{" +
    "var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}";

export const DECIPHER_NAME_REGEXPS = [
    "\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)",
    "\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)",
    '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
    '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];

export const SCVR = "[a-zA-Z0-9$_]";
export const FNR = `${SCVR}+`;
export const AAR = "\\[(\\d+)]";

export const N_TRANSFORM_NAME_REGEXPS = [
    `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${
        SCVR
    }+\\.get\\(${SCVR}+\\)\\)&&\\(${SCVR}+=(${SCVR}+)\\[(\\d+)]`,
    `${SCVR}+="nn"\\[\\+${SCVR}+\\.${SCVR}+],${SCVR}+=${SCVR}+\\.get\\(${
        SCVR
    }+\\)\\).+\\|\\|(${SCVR}+)\\(""\\)`,
    `\\(${SCVR}=String\\.fromCharCode\\(110\\),${SCVR}=${SCVR}\\.get\\(${
        SCVR
    }\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
    `\\.get\\("n"\\)\\)&&\\(${SCVR}=(${FNR})(?:${AAR})?\\(${SCVR}\\)`,
    // Skick regexps
    '(\\w+).length\\|\\|\\w+\\(""\\)',
    '\\w+.length\\|\\|(\\w+)\\(""\\)',
];

export const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${
    VARIABLE_PART_DEFINE
}${REVERSE_PART}|${VARIABLE_PART_DEFINE}${SLICE_PART}|${
    VARIABLE_PART_DEFINE
}${SPLICE_PART}|${VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;

export const DECIPHER_REGEXP =
    `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
    `a=a\\.split\\(""\\);\\s*` +
    `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
    `return a\\.join\\(""\\)` +
    `\\}`;

export const N_TRANSFORM_REGEXP =
    "function\\(\\s*(\\w+)\\s*\\)\\s*\\{" +
    'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
    "\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]" +
    "(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\" +
    '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
    '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';
