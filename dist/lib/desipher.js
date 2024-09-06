"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.desipherDownloadURL = void 0;
const querystring_1 = __importDefault(require("querystring"));
const regexp_1 = require("@/regexp/regexp");
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
        if (!nTransformScript)
            return url;
        const components = new URL(decodeURIComponent(url));
        const n = components.searchParams.get("n");
        if (!n)
            return url;
        const context = {};
        context[regexp_1.N_ARGUMENT] = n;
        const ncode = nTransformScript.runInNewContext(context);
        components.searchParams.set("n", ncode);
        return components.toString();
    };
    const isCipher = !format.url;
    const url = format.signatureCipher || format.cipher || format.url;
    format.url = nTransform(isCipher ? decipher(url) : url);
    return Object.assign(Object.assign({}, format), { signatureCipher: "", cipher: "" });
};
exports.desipherDownloadURL = desipherDownloadURL;
