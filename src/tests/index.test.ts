import YoutubeDlp from "..";
import axios from "axios";

describe("YoutubeDlp", () => {
    it("Get video by id", async () => {
        const youtubeDlp = new YoutubeDlp({ torRequest: true });

        const res = await youtubeDlp.getVideoById("mpHvHGMZ0jc");

        expect(res?.video.videoDetails.videoId).toEqual("mpHvHGMZ0jc");
    }, 100000);
});
