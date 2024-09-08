import { TFormat } from "./format";

export type TSteamingDataFormat = "formats";

export interface TStreamingData {
    expiresInSeconds: string;
    formats: TFormat[];
    adaptiveFormats: TFormat[];
    serverAbrStreamingUrl: string;
}
