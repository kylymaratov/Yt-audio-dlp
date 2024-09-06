import YoutubeDlp from "..";
import axios from "axios";

describe("YoutubeDlp", () => {
    it("Get video by id", async () => {
        const youtubeDlp = new YoutubeDlp();

        const res = await youtubeDlp.getAudioById("mpHvHGMZ0jc");

        expect(res.audio.details.videoId).toEqual("mpHvHGMZ0jc");
    }, 30000);
});
