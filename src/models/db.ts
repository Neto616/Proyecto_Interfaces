import dotenv from 'dotenv';
dotenv.config();
import mysql, { PoolOptions } from "mysql2/promise";
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

abstract class DB {
    private configuration: PoolOptions;
    protected connection!:mysql.Connection;
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
        this.PoolConnect().then(()=> console.log("Se ha conectado a la base de datos")).catch(error => console.log(error))
    }

    /**
     * PoolConnect
     */
    public async PoolConnect() {
        try {
            this.connection = await mysql.createConnection(this.configuration);
        } catch (error) {
            console.log(error);
            return
        }        
    }
}

export default DB;