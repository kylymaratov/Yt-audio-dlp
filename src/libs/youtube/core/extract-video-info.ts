import * as cheerio from "cheerio";
import { ErrorModule } from "@/utils/throw-error";
import { HTML_PAGE_SCRIPT_REGEX } from "@/libs/Youtube/constants";
import { TFormat } from "../../../types/format-types";
import { TPlayerResponse } from "../../../types/player-response-types";
import { TSteamingDataFormat } from "../../../types/streaming-data-types";
import { TAudio, TScripts } from "../../../types/audio-types";
import { desipherDownloadURL } from "./desipher-video-urls";

const exctractVideoInfo = (htmlContent: string, scripts: TScripts): TAudio => {
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
                    "Many requests, login required",
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

    const formats = exctractVideoFormats(playerResponse, scripts) || [];

    const details = (playerResponse as TPlayerResponse).videoDetails;

    return { details, formats };
};

function exctractVideoFormats(
    playerResponse: TPlayerResponse,
    scripts: TScripts
) {
    const formats: TFormat[] = [];
    const streamingData = playerResponse.streamingData || {};

    try {
        ["formats"].forEach((dataType) => {
            streamingData[dataType as TSteamingDataFormat].forEach((format) => {
                if (format) {
                    const decodedFormat = desipherDownloadURL(
                        format,
                        scripts.decipher,
                        scripts.nTransform
                    );
                    formats.push(decodedFormat);
                }
            });
        });
    } catch {
        return [];
    }

    return formats;
}

export { exctractVideoInfo };
