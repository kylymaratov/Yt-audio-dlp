import vm from "vm";
import { TFormat } from "@/types/format";
declare const desipherDownloadURL: (format: TFormat, decipherScript: vm.Script | null, nTransformScript: vm.Script | null) => TFormat;
export { desipherDownloadURL };
