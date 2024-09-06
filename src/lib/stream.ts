import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";
import { TFormat } from "@/types/format";
import { TAudio } from "@/types/audio";

async function fetchVideo(format: TFormat, headers: any): Promise<Readable> {
    console.info(`Fetching ${format.mimeType}`);

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
    videoStream: Readable
): Promise<Readable> {
    return new Promise((resolve, reject) => {
        const temporaryBuffer = new PassThrough();
        const audioStream = new Readable({
            read(size) {},
        });

        ffmpeg()
            .input(videoStream)
            .inputFormat("mp4")
            .noVideo()
            .audioCodec("libopus")
            .audioChannels(audio.formats[0].audioChannels)
            .outputOptions([`-b:a`, "128k", `-t`, audio.details.lengthSeconds])
            .toFormat("webm")
            .on("progress", (progress) => {
                const percentage =
                    (parseTimemark(progress.timemark) /
                        Number(audio.details.lengthSeconds)) *
                    100;
                process.stdout.write(`\r Progress: ${percentage.toFixed(2)}%`);
            })
            .on("error", (err) => reject(err))
            .pipe(temporaryBuffer, { end: true });

        temporaryBuffer.on("end", () => {
            audioStream.push(null);
            resolve(audioStream);
        });

        temporaryBuffer.on("data", (chunk) => {
            audioStream.push(chunk);
        });

        temporaryBuffer.on("error", (err) => {
            reject(err);
        });
    });
}

async function getAudioStream({
    audio,
    headers,
}: {
    audio: TAudio;
    headers: any;
}): Promise<Readable> {
    const videoStream = await fetchVideo(audio.formats[0], headers);

    const audioStream = await convertVideoToAudio(audio, videoStream);

    return audioStream;
}

export { getAudioStream };
