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
const net_1 = __importDefault(require("net"));
class TorControl {
    constructor(torOptions) {
        this.host = (torOptions === null || torOptions === void 0 ? void 0 : torOptions.host) || "127.0.0.1";
        this.port = (torOptions === null || torOptions === void 0 ? void 0 : torOptions.port) || 9050;
        this.password = (torOptions === null || torOptions === void 0 ? void 0 : torOptions.password) || "";
        this.client = null;
        this.connected = false;
        this.connect().catch((err) => console.error("Connection error:", err.message));
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.client = new net_1.default.Socket();
            this.client.connect(this.port, this.host, () => {
                this.client.write(`AUTHENTICATE "${this.password}"\r\n`);
            });
            this.client.on("data", (data) => {
                const response = data.toString();
                if (response.includes("250 OK")) {
                    this.connected = true;
                    resolve();
                }
                else if (response.includes("515 Authentication failed")) {
                    reject(new Error("Authentication failed"));
                }
                else {
                    reject(new Error("Unexpected response: " + response));
                }
            });
            this.client.on("error", (err) => {
                console.error("Connection error:", err.message);
                reject(err);
            });
            this.client.on("end", () => {
                this.connected = false;
            });
        });
    }
    sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.connected || !this.client) {
                return reject(new Error("Not connected to Tor control port"));
            }
            console.log(`Sending command: ${command}`);
            this.client.write(`${command}\r\n`);
            const onData = (data) => {
                const response = data.toString();
                console.log("Received data:", response);
                if (response.includes("250 OK")) {
                    this.client.removeListener("data", onData);
                    resolve(response);
                }
                else {
                    this.client.removeListener("data", onData);
                    reject(new Error("Error executing command: " + response));
                }
            };
            this.client.on("data", onData);
        });
    }
    updateNodes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect(); // Ensure connected before sending command
                const response = yield this.sendCommand("SIGNAL NEWNYM");
                console.log("Tor nodes updated successfully:", response);
            }
            catch (err) {
                console.error("Failed to update Tor nodes:", err.message);
            }
            finally {
                if (this.client) {
                    this.client.end();
                }
            }
        });
    }
}
exports.default = TorControl;
