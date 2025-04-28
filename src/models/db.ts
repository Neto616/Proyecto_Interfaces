
import dotenv from 'dotenv';
dotenv.config();
import mysql, { PoolOptions, Connection } from "mysql2/promise";

class DB {
    private configuration: PoolOptions;
    private connection!:Connection|null;
    constructor() {
        this.configuration = {
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASS,
            database: process.env.DB,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        }
    }

    /**
     * PoolConnect
     */
    public async connect():Promise<Connection> {
        if(!this.connection) {
            this.connection = await mysql.createConnection(this.configuration);
            console.log("Se ha conectado a base de datos");
        }

        return this.connection;     
    }
}

export const db = new DB();