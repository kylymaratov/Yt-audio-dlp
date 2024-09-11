import { VIDEO_ID_REGEXP } from "@/libs/Youtube/constants";

export const checkVideoId = (id: string) => VIDEO_ID_REGEXP.test(id);
