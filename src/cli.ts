#!/usr/bin/env node

import YoutubeAudio from ".";
import { Readable } from "stream";
import { Command } from "commander";
import { createWriteStream } from "fs";
import { join } from "path";
import { extractVideoId } from "./scripts/extract-video-id";

const program = new Command();

program
    .version("1.0.5")
    .description(
        "Node.js library for downloading songs from popular music platforms"
    )
    .option("-u, --url <type>", "Youtube audio url")
    .option("-f, --format <type>", "mp3, web, ogg, opus, wav formats")
    .action(async (options) => {
        try {
            const youtubeAudio = new YoutubeAudio();
            const { url, format = "mp3" } = options;

            const id = extractVideoId(url);

            if (!id) {
                throw new Error("Incorrect url");
            }

            const { buffer, audio } = await youtubeAudio.getAudioById(id, {
                outputFormat: format,
            });

            const stream = Readable.from(buffer);

            stream.pipe(
                createWriteStream(
                    join(
                        __dirname,
                        `${audio.details.title} - ${audio.details.videoId}.${format}`
                    )
                )
            );

            console.info(`${audio.details.title} download complete!`);
        } catch (error) {
            console.error("Error:", (error as Error).message);

            process.exit(1);
        }
    });

program.parse(process.argv);
