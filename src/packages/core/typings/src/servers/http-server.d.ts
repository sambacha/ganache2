import { TemplatedApp } from "@trufflesuite/uws-js-unofficial";
import { Connector } from "@ganache/flavors";
import { InternalOptions } from "../options";
export declare type HttpServerOptions = Pick<InternalOptions["server"], "rpcEndpoint">;
export default class HttpServer {
    #private;
    constructor(app: TemplatedApp, connector: Connector, options: HttpServerOptions);
    close(): void;
}
//# sourceMappingURL=http-server.d.ts.map