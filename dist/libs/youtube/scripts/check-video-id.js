"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVideoId = void 0;
const constants_1 = require("@/libs/youtube/constants");
const checkVideoId = (id) => constants_1.VIDEO_ID_REGEXP.test(id);
exports.checkVideoId = checkVideoId;
