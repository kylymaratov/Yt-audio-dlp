import "./path-register";
import { checkVideoId } from "@/regexp/check-regexp";
import { fetchHtml } from "@/lib/fetcher";
import { exctractAudioInfo, extractFunctions } from "@/lib/exctractor";

import { TAudio } from "./types/audio";
import { getAudioStream } from "./lib/stream";
import { Readable } from "stream";
import { createWriteStream } from "fs";

class YoutubeDlp {
    async getAudioById(
        id: string
    ): Promise<{ audio: TAudio; stream: Readable; headers: any }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");

            const webData = await fetchHtml(id);

            const scripts = await extractFunctions(webData);
            const audio = exctractAudioInfo(webData.htmlContent, scripts);

            const stream = await getAudioStream({
                audio,
                headers: webData.headers,
            });

            return {
                audio,
                stream,
                headers: webData.headers,
            };
        } catch (e) {
            throw e;
        }
    }
}

export default YoutubeDlp;
