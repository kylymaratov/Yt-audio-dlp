import vm from "vm";
import { TFormat } from "@/types/format";
declare const extractFunctions: (htmlContent: string) => Promise<{
    decipher: vm.Script | null;
    nTransform: vm.Script | null;
}>;
declare const desipherDownloadURL: (format: TFormat, decipherScript: vm.Script | null, nTransformScript: vm.Script | null) => TFormat;
export { extractFunctions, desipherDownloadURL };
