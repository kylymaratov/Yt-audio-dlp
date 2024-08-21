import axios, { AxiosRequestConfig } from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
//
import {
    ANDROID_CLIENT_VERSION,
    ANDROID_OS_VERSION,
    ANDROID_SDK_VERSION,
    youtubeUrls,
} from "@/helpers/constants";
import { HTML5_PLAYER_REGEX } from "@/regexp/regexp";
import { TFormat } from "@/types/format";
import { generateClientPlaybackNonce } from "@/helpers/utils";
import { TPlayerResponse } from "@/types/player-response";
import { TOptions } from "@/types/options";
import ErrorModule from "./error";
import {
    getRandomUserAgent,
    getRandomYouTubeUserAgent,
} from "@/helpers/user-agent";

const socksAgent = new SocksProxyAgent("socks5://127.0.0.1:9050");

export const fetchHtml = async (
    url: string,
    options: TOptions
): Promise<{ htmlContent: any; userAgent: string; cookies: string }> => {
    console.info(`Fetching html page: ${url}`);

    if (options.torRequest) {
        console.log(
            `Tor proxy ${socksAgent.proxy.host}:${socksAgent.proxy.port}`
        );
    }
    const userAgent = getRandomUserAgent();

    const response = await axios.get(url, {
        httpAgent: options.torRequest ? socksAgent : null,
        httpsAgent: options.torRequest ? socksAgent : null,
        headers: {
            "User-Agent": userAgent,
        },
    });
    return {
        htmlContent: response.data,
        userAgent: userAgent,
        cookies: response.headers["set-cookie"]?.toString() || "",
    };
};

export const fetchtHTML5Player = async (htmlContent: string) => {
    const html5PlayerRes = HTML5_PLAYER_REGEX.exec(htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = youtubeUrls.base + html5PlayerUrl;

    console.info(`Fetching player js: ${requestUrl}`);

    const response = await axios.get(requestUrl);

    return response.data;
};

export const fetchAndroidJsonPlayer = async (
    videoId: string,
    options: TOptions
): Promise<{
    androidFormats: TFormat[];
    userAgent: string;
    cookies: string;
}> => {
    try {
        const { userAgent } = getRandomYouTubeUserAgent();

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
                "User-Agent": userAgent,
                "X-Goog-Api-Format-Version": "2",
            },
            data: JSON.stringify(payload),
        };

        console.info(`Fetching android player: ${youtubeUrls.androidPlayer}`);

        if (options.torRequest) {
            console.log(
                `Tor proxy ${socksAgent.proxy.host}:${socksAgent.proxy.port}`
            );
        }
        const response = await axios<TPlayerResponse>(
            youtubeUrls.androidPlayer,
            {
                ...config,
                httpAgent: options.torRequest ? socksAgent : null,
                httpsAgent: options.torRequest ? socksAgent : null,
            }
        );

        if (response.data.playabilityStatus.status === "LOGIN_REQUIRED") {
            throw new ErrorModule(
                "Failed while exctract andorid player",
                response.data.playabilityStatus.status
            );
        }

        if (response.data.playabilityStatus.status !== "OK") {
            console.info(`Failed fetch andorid player`);
            throw new ErrorModule("Failed fetch andorid player");
        }

        return {
            androidFormats: response.data.streamingData.adaptiveFormats,
            userAgent,
            cookies: response.headers["set-cookie"]?.toString() || "",
        };
    } catch (e) {
        return {
            androidFormats: [],
            userAgent: "",
            cookies: "",
        };
    }
};
