import vm from "vm";
import querystring from "querystring";
import { fetchtHTML5Player } from "./downloader";
import { TFormat } from "@/types/format";

import {
    DECIPHER_ARGUMENT,
    DECIPHER_FUNC_NAME,
    DECIPHER_NAME_REGEXPS,
    DECIPHER_REGEXP,
    HELPER_REGEXP,
    N_ARGUMENT,
    N_TRANSFORM_FUNC_NAME,
    N_TRANSFORM_NAME_REGEXPS,
    N_TRANSFORM_REGEXP,
} from "@/regexp/regexp";

const matchRegex = (regex: string, str: string): RegExpMatchArray => {
    const match = str.match(new RegExp(regex, "s"));
    if (!match) throw new Error(`Could not match ${regex}`);
    return match;
};

const matchFirst = (regex: string, str: string): string =>
    matchRegex(regex, str)[0];

const matchGroup1 = (regex: string, str: string): string =>
    matchRegex(regex, str)[1];

const getFuncName = (body: string, regexps: string[]): string => {
    let fn: string | undefined;
    for (const regex of regexps) {
        try {
            fn = matchGroup1(regex, body);
            try {
                fn = matchGroup1(
                    `${fn.replace(/\$/g, "\\$")}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`,
                    body
                );
            } catch {}
            break;
        } catch {
            continue;
        }
    }
    if (!fn || fn.includes("["))
        throw new Error("Function name extraction failed");

    return fn;
};

const extractDecipherFunc = (body: string): string | null => {
    try {
        const helperObject = matchFirst(HELPER_REGEXP, body);
        const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
        const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
        const callerFunc = `${DECIPHER_FUNC_NAME}(${DECIPHER_ARGUMENT});`;
        return helperObject + resultFunc + callerFunc;
    } catch {
        return null;
    }
};

const extractDecipherWithName = (body: string): string | null => {
    try {
        const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
        const funcPattern = `(${decipherFuncName.replace(/\$/g, "\\$")}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
        const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
        const helperObjectName = matchGroup1(
            ";([A-Za-z0-9_\\$]{2,})\\.\\w+\\(",
            decipherFunc
        );
        const helperPattern = `(var ${helperObjectName.replace(/\$/g, "\\$")}=\\{[\\s\\S]+?\\}\\};)`;
        const helperObject = matchGroup1(helperPattern, body);
        const callerFunc = `${decipherFuncName}(${DECIPHER_ARGUMENT});`;
        return helperObject + decipherFunc + callerFunc;
    } catch {
        return null;
    }
};

const getExtractFunctions = (
    extractFunctions: ((body: string) => string | null)[],
    body: string
): vm.Script | null => {
    for (const extractFunction of extractFunctions) {
        try {
            const func = extractFunction(body);
            if (!func) continue;
            return new vm.Script(func);
        } catch {
            continue;
        }
    }

    return null;
};

const extractDecipher = (body: string): vm.Script | null => {
    const decipherFunc = getExtractFunctions(
        [extractDecipherWithName, extractDecipherFunc],
        body
    );
    return decipherFunc;
};

const extractNTransformFunc = (body: string): string | null => {
    try {
        const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
        const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
        const callerFunc = `${N_TRANSFORM_FUNC_NAME}(${N_ARGUMENT});`;
        return resultFunc + callerFunc;
    } catch {
        return null;
    }
};

const extractNTransformWithName = (body: string): string | null => {
    try {
        const nFuncName = getFuncName(body, N_TRANSFORM_NAME_REGEXPS);

        const funcPattern = `(${
            nFuncName.replace(/\$/g, "\\$")
            // eslint-disable-next-line max-len
        }=\\s*function([\\S\\s]*?\\}\\s*return (([\\w$]+?\\.join\\(""\\))|(Array\\.prototype\\.join\\.call\\([\\w$]+?,[\\n\\s]*(("")|(\\("",""\\)))\\)))\\s*\\}))`;
        const nTransformFunc = `var ${matchGroup1(funcPattern, body)};`;
        const callerFunc = `${nFuncName}(${N_ARGUMENT});`;
        return nTransformFunc + callerFunc;
    } catch {
        return null;
    }
};

const extractNTransform = (body: string): vm.Script | null => {
    const nTransformFunc = getExtractFunctions(
        [extractNTransformFunc, extractNTransformWithName],
        body
    );

    return nTransformFunc;
};

const extractFunctions = async (
    htmlContent: string
): Promise<{ decipher: vm.Script | null; nTransform: vm.Script | null }> => {
    const body = await fetchtHTML5Player(htmlContent);
    const decipher = extractDecipher(body);
    const nTransform = extractNTransform(body);

    return { decipher, nTransform };
};

const desipherDownloadURL = (
    format: TFormat,
    decipherScript: vm.Script | null,
    nTransformScript: vm.Script | null
): TFormat => {
    const decipher = (url: string): string => {
        if (!decipherScript) return url;
        const args = querystring.parse(url);

        if (!args.s) return args.url as string;

        const components = new URL(decodeURIComponent(args.url as string));
        const context: { [key: string]: string } = {};
        context[DECIPHER_ARGUMENT] = decodeURIComponent(args.s as string);
        const sig = decipherScript.runInNewContext(context);
        components.searchParams.set("sig", sig);
        return components.toString();
    };

    const nTransform = (url: string): string => {
        const components = new URL(decodeURIComponent(url));

        const n = components.searchParams.get("n");

        if (!n || !nTransformScript) return url;
        const context: { [key: string]: string } = {};
        context[N_ARGUMENT] = n;
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

export { extractFunctions, desipherDownloadURL };
