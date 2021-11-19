import { TemplatedApp, WebSocket } from "@trufflesuite/uws-js-unofficial";
import { InternalOptions } from "../options";
import * as Flavors from "@ganache/flavors";
declare type HandlesWebSocketSignature = (payload: any, connection: WebSocket) => any;
declare type WebSocketCapableFlavorMap = {
    [k in keyof Flavors.ConnectorsByName]: Flavors.ConnectorsByName[k]["handle"] extends HandlesWebSocketSignature ? Flavors.ConnectorsByName[k] : never;
};
export declare type WebSocketCapableFlavor = {
    [k in keyof WebSocketCapableFlavorMap]: WebSocketCapableFlavorMap[k];
}[keyof WebSocketCapableFlavorMap];
export declare type GanacheWebSocket = WebSocket & {
    closed?: boolean;
};
export declare type WebsocketServerOptions = Pick<InternalOptions["server"], "wsBinary" | "rpcEndpoint">;
export declare const MAX_PAYLOAD_SIZE: number;
export default class WebsocketServer {
    #private;
    constructor(app: TemplatedApp, connector: WebSocketCapableFlavor, options: WebsocketServerOptions);
    close(): void;
}
export {};
//# sourceMappingURL=ws-server.d.ts.map