import { TFormat } from "@/types/format";
import { TOptions } from "@/types/options";
export declare const fetchHtml: (url: string, options: TOptions) => Promise<{
    htmlContent: any;
    userAgent: string;
    cookies: string;
}>;
export declare const fetchtHTML5Player: (htmlContent: string) => Promise<any>;
export declare const fetchAndroidJsonPlayer: (videoId: string, options: TOptions) => Promise<{
    androidFormats: TFormat[];
    userAgent: string;
    cookies: string;
}>;
