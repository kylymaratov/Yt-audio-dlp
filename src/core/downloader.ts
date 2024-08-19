import {
    ANDROID_CLIENT_VERSION,
    ANDROID_OS_VERSION,
    ANDROID_SDK_VERSION,
    youtubeUrls,
} from "@/helpers/constants";
import { HTML5_PLAYER_REGEX } from "@/regexp/regexp";
import axios, { AxiosRequestConfig } from "axios";
import * as http from "https";
import ffmpeg from "fluent-ffmpeg";
import { TAudioFormat, TFormat } from "../types/format";
import { generateClientPlaybackNonce } from "@/helpers/utils";
import { TPlayerResponse } from "../types/player-response";

export const fetchHtml = async (
    url: string,
    options: AxiosRequestConfig = {}
) => {
    const response = await axios.get(url, options);
    console.log(`Fetching html page: ${url}`);

    return response.data;
};

export const fetchtHTML5Player = async (htmlContent: string) => {
    const html5PlayerRes = HTML5_PLAYER_REGEX.exec(htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = youtubeUrls.base + html5PlayerUrl;

    console.info(`Fething player js: ${requestUrl}`);

    const response = await axios.get(requestUrl);

    return response.data;
};

export const fetchAudioStream = (
    url: string,
    format: TAudioFormat
): Promise<ffmpeg.FfmpegCommand> => {
    return new Promise((res, rej) => {
        http.get(url, (response) => {
            const stream = ffmpeg()
                .input(response)
                .noVideo()
                .audioCodec(format === "mp3" ? "libmp3lame" : "libopus")
                .format(format);

            response.on("error", (err) => {
                rej(err);
            });
            stream.on("error", (err) => rej(err));

            res(stream);
        });
    });
};

export const fetchAndroidJsonPlayer = async (
    videoId: string
): Promise<TFormat[]> => {
    try {
        const payload = {
            videoId,
            cpn: generateClientPlaybackNonce(16),
            contentCheckOk: true,
            racyCheckOk: true,
            context: {
                client: {
                    clientName: "ANDROID",
                    clientVersion: ANDROID_CLIENT_VERSION,
                    platform: "MOBILE",
                    osName: "Android",
                    osVersion: ANDROID_OS_VERSION,
                    androidSdkVersion: ANDROID_SDK_VERSION,
                    hl: "en",
                    gl: "US",
                    utcOffsetMinutes: -240,
                },
                request: {
                    internalExperimentFlags: [],
                    useSsl: true,
                },
                user: {
                    lockedSafetyMode: false,
                },
            },
        };

        const config: AxiosRequestConfig = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `com.google.android.youtube/${
                    ANDROID_CLIENT_VERSION
                } (Linux; U; Android ${ANDROID_OS_VERSION}; en_US) gzip`,
                "X-Goog-Api-Format-Version": "2",
            },
            data: JSON.stringify(payload),
        };

        console.info(`Fetching android player: ${youtubeUrls.androidPlayer}`);

        const response = await axios<TPlayerResponse>(
            youtubeUrls.androidPlayer,
            config
        );

        if (response.data.playabilityStatus.status !== "OK") {
            console.info(`Failed fetch andorid player`);
            return [];
        }

        return response.data.streamingData.adaptiveFormats;
    } catch (e) {
        return [];
    }
};
