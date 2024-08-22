import { TTorOptions } from "@/types/options";
declare class TorControl {
    private host;
    private port;
    private password;
    private client;
    private connected;
    constructor(torOptions?: TTorOptions);
    private connect;
    private sendCommand;
    updateNodes(): Promise<void>;
}
export default TorControl;
