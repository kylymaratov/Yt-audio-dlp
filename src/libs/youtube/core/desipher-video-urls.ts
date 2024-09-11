import vm from "vm";
import querystring from "querystring";
import { TFormat } from "@/types/format-types";
import { DECIPHER_ARGUMENT, N_ARGUMENT } from "@/libs/youtube/constants";

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
        if (!nTransformScript) return url;
        const components = new URL(decodeURIComponent(url));

        const n = components.searchParams.get("n");

        if (!n) return url;
        const context: { [key: string]: string } = {};
        context[N_ARGUMENT] = n;
        const ncode = nTransformScript.runInNewContext(context);
        components.searchParams.set("n", ncode);
        return components.toString();
    };
    const isCipher = !format.url;

    const url = format.signatureCipher || format.cipher || format.url;

    format.url = nTransform(isCipher ? decipher(url) : url);

    return {
        ...format,
        signatureCipher: "",
        cipher: "",
    };
};

export { desipherDownloadURL };
