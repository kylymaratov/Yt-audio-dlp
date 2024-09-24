import { TFetchHTMLResponse } from "@/types/player-response-types";
import { TOptions } from "@/types/options-types";
export declare const fetchHtmlPage: (id: string, options: TOptions) => Promise<TFetchHTMLResponse>;
export declare const fetchtHTML5Player: (webData: TFetchHTMLResponse) => Promise<any>;
