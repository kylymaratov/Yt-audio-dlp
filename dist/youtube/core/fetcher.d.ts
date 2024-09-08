import { TFetchHTMLResponse } from "@/youtube/types/player-response";
import { TFormat } from "@/youtube/types/format";
import { Readable } from "stream";
import { TOptions } from "@/youtube/types/options";
export declare const fetchHtml: (id: string, options: TOptions) => Promise<TFetchHTMLResponse>;
export declare const fetchtHTML5Player: (webData: TFetchHTMLResponse) => Promise<any>;
export declare const fetchVideo: (format: TFormat, headers: any) => Promise<Readable>;
