import { TStreamingData } from "./streaming-data-types";
import { TDetails } from "./audio-types";
import { SocksProxyAgent } from "socks-proxy-agent";

export interface TPlayerResponse {
    videoDetails: TDetails;
    streamingData: TStreamingData;
    playabilityStatus: {
        status: "LOGIN_REQUIRED" | "OK";
        reason: string;
        contextParams: string;
    };
}
export interface TFetchHTMLResponse {
    htmlContent: any;
    headers: any;
    socksProxy?: SocksProxyAgent;
    proxy?: {
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        };
    };
}
