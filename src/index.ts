import "./path-register";

import { checkVideoId } from "./scripts/check-video-id";
import { fetchHtmlPage } from "./core/fetch-html-page";
import { exctractVideoInfo } from "./core/extract-video-info";
import { TAudio } from "./types/audio-types";
import { createAudioBuffer } from "./utils/create-audio-buffer";
import { clearLogger } from "./utils/logger";
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
    }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            options = { ...defaultOptions, ...options };

            const webData = await fetchHtmlPage(id, options);

            const scripts = await extractDesipherFunctions(webData);

            const video = exctractVideoInfo(webData.htmlContent, scripts);

            const buffer = await createAudioBuffer(
                video,
                webData.headers,
                options
            );

            return {
                audio: video,
                buffer,
                headers: webData.headers,
            };
        } catch (e) {
            throw e;
        } finally {
            clearLogger();
        }
    }
}

export default YoutubeAudio;
