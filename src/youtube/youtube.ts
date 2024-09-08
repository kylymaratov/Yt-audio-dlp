import { checkVideoId } from "./regexp/check-regexp";
import { fetchHtml } from "./core/fetcher";
import { exctractAudioInfo, extractFunctions } from "./core/exctractor";
import { TAudio } from "./types/audio";
import { getAudioStream } from "./core/stream";
import { Readable } from "stream";
import { clearCustomLogs } from "./core/logs";
import { TOptions } from "./types/options";
import { defaultOptions } from "@/helpers/constants";

export class Youtube {
    async getAudioById(
        id: string,
        options?: TOptions
    ): Promise<{
        audio: TAudio;
        stream: Readable;
        headers: any;
        options: TOptions;
    }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            options = { ...defaultOptions, ...options };

            const webData = await fetchHtml(id, options);

            const scripts = await extractFunctions(webData);

            const audio = exctractAudioInfo(webData.htmlContent, scripts);

            const stream = await getAudioStream(
                audio,
                webData.headers,
                options.outputFormat || "webm"
            );

            return {
                audio,
                stream,
                headers: webData.headers,
                options,
            };
        } catch (e) {
            throw e;
        } finally {
            clearCustomLogs();
        }
    }
}

export default Youtube;
