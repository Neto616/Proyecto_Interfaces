import dotenv from 'dotenv';
dotenv.config();
import mysql, { PoolOptions, Connection } from "mysql2/promise";
import { createClient } from "redis"

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
    
    public async connect():Promise<Connection> {
        if(!this.connection) {
            this.connection = await mysql.createConnection(this.configuration);
            console.log("Se ha conectado a base de datos");
        }

        return this.connection;     
    }
}

class redisDB {
    public client;
    constructor(){
        this.client = createClient({
            username: process.env.REDIS_USER || '',
            password: process.env.REDIS_PASS || '',
            socket: {
                host: process.env.REDIS_HOST || '',
                port: parseInt(process.env.REDIS_PORT || "6379") 
            }
        });
        this.client.on('error', (error) => console.log("Ha ocurrido un error al conectarse con redis: ", error));
    }

    public async connectDb() {
        await this.client.connect();
        console.log("Conexión exitosa");
    }

    public async deleteDb(){
        return await this.client.flushDb();
    }

    public async getAllData() {
        const keys = await this.client.keys("*");
        const result = [];
        for (const key of keys) {
            const value = await this.client.get(key);
            result.push({key, value});
        }
        console.log("Todos los datos de la base son: ", result)
    }

    public async getData(key: string) {
        try {
            return await this.client.get(key) ?? "[]";
        } catch (error) {
            return ""
        }
    }

    public async setData(key: string, value: string){
        try {
            await this.client.set(key, value);
            return ;
        } catch (error) {
            console.log("Ocurrio un error guardando la info :C", error)
        }
    }

    public async getJSONData(key: string){
        return await this.client.hGetAll(key);
    }

    public async setJSONData(key: string, value: any){
        await this.client.hSet(key, value);
        return ;
    }
}

export const db = new DB();
export const dbRedis = new redisDB();