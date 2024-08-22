"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tor_control_1 = __importDefault(require("tor-control"));
class MyTor extends tor_control_1.default {
    constructor(torOptions) {
        super({
            host: (torOptions === null || torOptions === void 0 ? void 0 : torOptions.host) || "127.0.0.1",
            port: (torOptions === null || torOptions === void 0 ? void 0 : torOptions.port) || 9050,
            password: (torOptions === null || torOptions === void 0 ? void 0 : torOptions.password) || "",
        });
    }
    newNym() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.signal("NEWNYM");
                console.info("Tor nodes have been changed.");
                return;
            }
            catch (err) {
                console.error("Error:", err);
                throw err;
            }
        });
    }
}
exports.default = MyTor;
