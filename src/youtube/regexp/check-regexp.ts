import { VIDEO_ID_REGEXP } from "@/youtube/regexp/regexp";

export const checkVideoId = (id: string) => VIDEO_ID_REGEXP.test(id);
