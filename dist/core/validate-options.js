"use strict";
// import axios  from "axios";
// import { TOptions } from "@/types/options";
// import { TVideo } from "@/types/video-details";
// export const validateByOptions = async (video: TVideo, opt: TOptions): Promise<TVideo> => {
//     if (opt.format === "audioOnly") {
//         video.formats = video?.formats.filter(f => f.mimeType.includes("audio/"));
//     }
//     if (opt.checkWorkingLinks) {
//         const work_formats = [];
//          for (let f of video.formats) {
//             try {               
//                 if (!f.url) continue;
//                 await axios.get(f.url, {method: "HEAD", timeout: 2000});
//                 work_formats.push(f)
//             } catch (e) {
//                 continue
//             }
//         }
//         video.formats = work_formats;
//     }
//     return video  
// }
