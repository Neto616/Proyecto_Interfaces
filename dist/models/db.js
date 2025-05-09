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
exports.dbRedis = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promise_1 = __importDefault(require("mysql2/promise"));
const redis_1 = require("redis");
class DB {
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
        };
    }
    /**
     * PoolConnect
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connection) {
                this.connection = yield promise_1.default.createConnection(this.configuration);
                console.log("Se ha conectado a base de datos");
            }
            return this.connection;
        });
    }
}
class redisDB {
    constructor() {
        this.client = (0, redis_1.createClient)({
            username: process.env.REDIS_USER || '',
            password: process.env.REDIS_PASS || '',
            socket: {
                host: process.env.REDIS_HOST || '',
                port: parseInt(process.env.REDIS_PORT || "6379")
            }
        });
        this.client.on('error', (error) => console.log("Ha ocurrido un error al conectarse con redis: ", error));
    }
    connectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            console.log("Conexión exitosa");
        });
    }
    getAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.client.keys("*");
            const result = [];
            for (const key of keys) {
                const value = yield this.client.get(key);
                result.push({ key, value });
            }
            console.log("Todos los datos de la base son: ", result);
            yield this.client.quit();
        });
    }
    getData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(key);
        });
    }
    setData(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value);
            return;
        });
    }
    getJSONData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.hGetAll(key);
        });
    }
    setJSONData(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.hSet(key, value);
            return;
        });
    }
}
exports.db = new DB();
exports.dbRedis = new redisDB();
