import { TScripts } from "@/types/audio-types";
import { TFetchHTMLResponse } from "@/types/player-response-types";
declare const extractDesipherFunctions: (webData: TFetchHTMLResponse) => Promise<TScripts>;
export { extractDesipherFunctions };
