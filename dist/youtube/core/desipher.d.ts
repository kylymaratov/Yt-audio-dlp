import vm from "vm";
import { TFormat } from "@/youtube/types/format";
declare const desipherDownloadURL: (format: TFormat, decipherScript: vm.Script | null, nTransformScript: vm.Script | null) => TFormat;
export { desipherDownloadURL };
