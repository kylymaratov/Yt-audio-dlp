import { TFetchHTMLResponse } from "@/types/player-response";
import { TFormat } from "@/types/format";
import { Readable } from "stream";
import { TOptions } from "@/types/options";
export declare const fetchHtml: (id: string, options: TOptions) => Promise<TFetchHTMLResponse>;
export declare const fetchtHTML5Player: (webData: TFetchHTMLResponse) => Promise<any>;
export declare const fetchVideo: (format: TFormat, headers: any) => Promise<Readable>;
