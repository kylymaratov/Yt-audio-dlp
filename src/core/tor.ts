import { TTorOptions } from "@/types/options";
import net, { Socket } from "net";

class TorControl {
    private host: string;
    private port: number;
    private password: string;
    private client: Socket | null;
    private connected: boolean;

    constructor(torOptions?: TTorOptions) {
        this.host = torOptions?.host || "127.0.0.1";
        this.port = torOptions?.port || 9050;
        this.password = torOptions?.password || "";
        this.client = null;
        this.connected = false;
        this.connect().catch((err) =>
            console.error("Connection error:", err.message)
        );
    }

    private connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new net.Socket();

            this.client.connect(this.port, this.host, () => {
                this.client!.write(`AUTHENTICATE "${this.password}"\r\n`);
            });

            this.client.on("data", (data: Buffer) => {
                const response = data.toString();

                if (response.includes("250 OK")) {
                    this.connected = true;
                    resolve();
                } else if (response.includes("515 Authentication failed")) {
                    reject(new Error("Authentication failed"));
                } else {
                    reject(new Error("Unexpected response: " + response));
                }
            });

            this.client.on("error", (err: Error) => {
                console.error("Connection error:", err.message);
                reject(err);
            });

            this.client.on("end", () => {
                this.connected = false;
            });
        });
    }

    private sendCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.connected || !this.client) {
                return reject(new Error("Not connected to Tor control port"));
            }

            this.client.write(`${command}\r\n`);

            const onData = (data: Buffer) => {
                const response = data.toString();

                if (response.includes("250 OK")) {
                    this.client!.removeListener("data", onData);
                    resolve(response);
                } else {
                    this.client!.removeListener("data", onData);
                    reject(new Error("Error executing command: " + response));
                }
            };

            this.client.on("data", onData);
        });
    }

    public async updateNodes(): Promise<void> {
        try {
            await this.connect();
            await this.sendCommand("SIGNAL NEWNYM");
        } catch (err) {
            console.error(
                "Failed to update Tor nodes:",
                (err as Error).message
            );
        } finally {
            if (this.client) {
                this.client.end();
            }
        }
    }
    public async reloadNetwork(): Promise<void> {
        try {
            await this.connect();
            await this.sendCommand("SIGNAL RELOAD");
        } catch (err) {
            console.error(
                "Failed to reload Tor network:",
                (err as Error).message
            );
        } finally {
            if (this.client) {
                this.client.end();
            }
        }
    }
}

export default TorControl;
