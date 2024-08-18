"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVideoId = void 0;
const regexp_1 = require("@/regexp/regexp");
const checkVideoId = (id) => regexp_1.VIDEO_ID_REGEXP.test(id);
exports.checkVideoId = checkVideoId;
