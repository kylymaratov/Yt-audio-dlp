import { TFormat } from "./format-types";

export type TSteamingDataFormat = "formats";

export interface TStreamingData {
    expiresInSeconds: string;
    formats: TFormat[];
    adaptiveFormats: TFormat[];
    serverAbrStreamingUrl: string;
}
