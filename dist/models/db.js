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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promise_1 = __importDefault(require("mysql2/promise"));
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
        this.PoolConnect().then(() => console.log("Se ha conectado a la base de datos")).catch(error => console.log(error));
    }
    /**
     * PoolConnect
     */
    PoolConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield promise_1.default.createConnection(this.configuration);
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connection)
                    yield this.PoolConnect();
                return;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.default = DB;
