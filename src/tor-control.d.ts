declare module "tor-control" {
    export interface TorControlOptions {
        host: string;
        port: number;
        password?: string;
    }

    export class TorControl {
        constructor(options: TorControlOptions);
        authenticate(): Promise<void>;
        signal(signal: "NEWNYM"): Promise<void>;
    }

    export default TorControl;
}
