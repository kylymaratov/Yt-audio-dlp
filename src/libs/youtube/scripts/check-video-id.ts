import { VIDEO_ID_REGEXP } from "@/libs/youtube/constants";

export const checkVideoId = (id: string) => VIDEO_ID_REGEXP.test(id);
