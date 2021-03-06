import { Definitions } from "@ganache/options";
export declare type DatabaseConfig = {
    options: {
        /**
         * Specify an alternative database instance, like MemDOWN
         */
        db: {
            type: string | object;
            legacy: {
                /**
                 * @deprecated Use database.db instead
                 */
                db: string | object;
            };
        };
        /**
         * Specify a path to a directory to save the chain database. If a database
         * already exists, that chain will be initialized instead of creating a new
         * one.
         */
        dbPath: {
            type: string;
            legacy: {
                /**
                 * @deprecated Use database.dbPath instead
                 */
                db_path: string;
            };
        };
    };
    exclusiveGroups: [["db", "dbPath"]];
};
export declare const DatabaseOptions: Definitions<DatabaseConfig>;
//# sourceMappingURL=database-options.d.ts.map