import YoutubeDlp from "..";
import axios from "axios";

describe("YoutubeDlp", () => {
    it("Get video by id", async () => {
        const youtubeDlp = new YoutubeDlp();

        const res = await youtubeDlp.getVideoById("mpHvHGMZ0jc");
        expect(res.video.videoDetails.videoId).toEqual("mpHvHGMZ0jc");
    });

    it("Get video by html", async () => {
        const youtubeDlp = new YoutubeDlp();
        const response = await axios.get(
            "https://www.youtube.com/watch?v=oArXPR63Xc8"
        );
        const res = await youtubeDlp.getVideoByHtml(response.data);
        expect(res.videoDetails.videoId).toEqual("oArXPR63Xc8");
    });
});
