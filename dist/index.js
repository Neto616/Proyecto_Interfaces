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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const rt_views_1 = __importDefault(require("./routes/rt_views"));
const rt_controllers_1 = __importDefault(require("./routes/rt_controllers"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./models/db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const upload = (0, multer_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: (process.env.SECRET || ""),
    cookie: {
        maxAge: 1000 * 60 * 60,
        path: "/",
        secure: false
    },
    resave: false,
    saveUninitialized: true // Cambia a true para probar
}));
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "/client"))); // ejemplo si usas React
app.use((0, cors_1.default)());
app.use(upload.any());
app.use("/", rt_views_1.default);
app.use("/", rt_controllers_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.dbRedis.connectDb();
    // await dbRedis.setData("1", JSON);
    //     await dbRedis.setData("Llave_2", "Valor2");
    // await dbRedis.setData("Llave_3", JSON.stringify({
    //     mensajes: ["<div key='0' className='mensaje recibido'>Hola papu</div>", 
    //         "<div key='1' className='mensaje enviado'>Apoco si tilin?</div>",
    //     "<div key='2' className='mensaje recibido'>Chi</div>"]
    // }));
    // let resultado = await dbRedis.getData("4")
    // console.log(JSON.parse(resultado));
    // await dbRedis.getAllData();
    // await dbRedis.deleteDb();
}))();
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
