import ffmpeg from "fluent-ffmpeg";
import axios from "axios";

import { PassThrough, Readable } from "stream";
import { TAudio } from "@/types/audio-types";
import { TCodecs, TOutputFormats } from "@/types/options-types";
import { TFormat } from "@/types/format-types";

async function fetchVideo(format: TFormat, headers: any): Promise<Readable> {
    `Fetching data bytes ${format.mimeType}`;

    const response = await axios.get(format.url, {
        headers,
        responseType: "arraybuffer",
        timeout: 60000,
    });

    return Readable.from(response.data);
}

function parseTimemark(timemark: string): number {
    const [hours, minutes, seconds] = timemark.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function convertVideoToAudio(
    audio: TAudio,
    videoStream: Readable,
    outputFormat: TOutputFormats
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const temporaryBuffer = new PassThrough();
        const chunks: Buffer[] = [];

        ffmpeg()
            .input(videoStream)
            .inputFormat("mp4")
            .noVideo()
            .audioCodec(TCodecs[outputFormat])
            .audioChannels(audio.formats[0].audioChannels)
            .outputOptions([`-b:a`, "128k", `-t`, audio.details.lengthSeconds])
            .toFormat(outputFormat)
            .on("progress", (progress) => {
                const percentage =
                    (parseTimemark(progress.timemark) /
                        Number(audio.details.lengthSeconds)) *
                    100;
                process.stdout.write(
                    `\r Compiling progress: ${percentage.toFixed(2)}%`
                );
            })
            .on("error", (err) => reject(err))
            .pipe(temporaryBuffer, { end: true });

        temporaryBuffer.on("end", () => {
            process.stdout.write("\r\x1b[2K");
            resolve(Buffer.concat(chunks));
        });

        temporaryBuffer.on("data", (chunk) => {
            chunks.push(chunk);
        });

        temporaryBuffer.on("error", (err) => {
            reject(err);
        });
    });
}

async function createAudioStream(
    audio: TAudio,
    headers: any,
    outputFormat: TOutputFormats
): Promise<Buffer> {
    const videoStream = await fetchVideo(audio.formats[0], headers);

    const buffer = await convertVideoToAudio(audio, videoStream, outputFormat);

    return buffer;
}

export { createAudioStream };
