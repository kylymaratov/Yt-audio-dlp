import "./path-register";

import { Readable } from "stream";
import { checkVideoId } from "./scripts/check-video-id";
import { fetchHtmlPage } from "./core/fetch-html-page";
import { exctractVideoInfo } from "./core/extract-video-info";
import { TAudio } from "./types/audio-types";
import { createAudioStream } from "./utils/create-stream";
import { clearLogger } from ".//utils/lib-logger";
import { TOptions } from "./types/options-types";
import { defaultOptions } from ".//constants/constants";
import { extractDesipherFunctions } from "./core/extract-desipher-scripts";

export class YoutubeAudio {
    async getAudioById(
        id: string,
        options?: TOptions
    ): Promise<{
        audio: TAudio;
        buffer: Buffer;
        headers: any;
        options: TOptions;
    }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            options = { ...defaultOptions, ...options };

            const webData = await fetchHtmlPage(id, options);

            const scripts = await extractDesipherFunctions(webData);

            const video = exctractVideoInfo(webData.htmlContent, scripts);

            const buffer = await createAudioStream(
                video,
                webData.headers,
                options.outputFormat || "webm"
            );

            return {
                audio: video,
                buffer,
                headers: webData.headers,
                options,
            };
        } catch (e) {
            throw e;
        } finally {
            clearLogger();
        }
    }
}

export default YoutubeAudio;
