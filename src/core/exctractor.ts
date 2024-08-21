import * as cheerio from "cheerio";
import { streamingDataFormats } from "@/helpers/constants";
import { HTML_PAGE_SCRIPT_REGEX } from "@/regexp/regexp";
import { TFormat } from "../types/format";
import { TPlayerResponse } from "../types/player-response";
import { TSteamingDataFormat } from "../types/streaming-data";
import { TVideo } from "../types/video-details";
import ErrorModule from "./error";

export const exctractVideoInfo = (htmlContent: string): TVideo => {
    const $ = cheerio.load(htmlContent);
    const scriptTags = $("script");

    let playerResponse: TPlayerResponse | null = null;

    scriptTags.each((_, scriptTag) => {
        const scriptContent = $(scriptTag).html();
        if (scriptContent) {
            const match = scriptContent.match(HTML_PAGE_SCRIPT_REGEX);

            if (!match) return;

            playerResponse = JSON.parse(match[1]);

            if (playerResponse?.playabilityStatus.status === "LOGIN_REQUIRED") {
                throw new ErrorModule(
                    "Failed while exctract andorid player",
                    playerResponse.playabilityStatus.status
                );
            }
            if (playerResponse?.playabilityStatus.status !== "OK") {
                throw new ErrorModule(
                    playerResponse?.playabilityStatus.reason ||
                        "Error while exctract palyer response",
                    playerResponse?.playabilityStatus.status
                );
            }
        }
    });
    if (!playerResponse)
        throw new ErrorModule(
            "Incorrect HTML, video information not found",
            "INCORRECT_HTML"
        );

    const formats = exctractFormats(playerResponse) || [];

    const videoDetails = (playerResponse as TPlayerResponse).videoDetails;

    return { videoDetails, formats, adaptiveFormats: [] };
};

const exctractFormats = (playerResponse: TPlayerResponse) => {
    const formats: TFormat[] = [];
    const streamingData = playerResponse.streamingData || {};

    try {
        streamingDataFormats.forEach((dataType) => {
            streamingData[dataType as TSteamingDataFormat].forEach((format) => {
                if (!format) return;

                formats.push(format);
            });
        });
    } catch {
        return [];
    }

    return formats;
};

export const exctractExpireFromUrl = (url: string): number | null => {
    try {
        const urlObj = new URL(url);

        const expire = urlObj.searchParams.get("expire");

        if (!expire) return null;

        const expireTimestamp = parseInt(expire, 10);

        return expireTimestamp;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
};
