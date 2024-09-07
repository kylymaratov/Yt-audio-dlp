import "./path-register";
import { checkVideoId } from "@/regexp/check-regexp";
import { fetchHtml } from "@/lib/fetcher";
import { exctractAudioInfo, extractFunctions } from "@/lib/exctractor";

import { TAudio } from "./types/audio";
import { getAudioStream } from "./lib/stream";
import { Readable } from "stream";
import { clearCustomLogs } from "./lib/logs";

class YoutubeDlp {
    async getAudioById(
        id: string,
        withStream?: boolean
    ): Promise<{ audio: TAudio; stream: Readable | null; headers: any }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");

            const webData = await fetchHtml(id);

            const scripts = await extractFunctions(webData);
            const audio = exctractAudioInfo(webData.htmlContent, scripts);

            let stream: Readable | null = null;

            if (withStream) {
                stream = await getAudioStream({
                    audio,
                    headers: webData.headers,
                });
            }

            return {
                audio,
                stream,
                headers: webData.headers,
            };
        } catch (e) {
            throw e;
        } finally {
            clearCustomLogs();
        }
    }
}

export default YoutubeDlp;
