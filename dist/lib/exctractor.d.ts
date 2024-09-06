import { TAudio, TScripts } from "../types/audio";
import { TFetchHTMLResponse } from "@/types/response";
declare const exctractAudioInfo: (htmlContent: string, scripts: TScripts) => TAudio;
declare const extractFunctions: (webData: TFetchHTMLResponse) => Promise<TScripts>;
export { exctractAudioInfo, extractFunctions };
