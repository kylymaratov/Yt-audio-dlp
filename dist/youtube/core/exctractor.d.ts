import { TAudio, TScripts } from "../types/audio";
import { TFetchHTMLResponse } from "@/youtube/types/player-response";
declare const exctractAudioInfo: (htmlContent: string, scripts: TScripts) => TAudio;
declare const extractFunctions: (webData: TFetchHTMLResponse) => Promise<TScripts>;
export { exctractAudioInfo, extractFunctions };
