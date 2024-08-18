import { TFormat } from "./format";

export type TSteamingDataFormat = "formats" | "adaptiveFormats"

export interface TStreamingData  {
     expiresInSeconds: string;
     formats: TFormat[]
     adaptiveFormats: TFormat[]
     serverAbrStreamingUrl: string
}