"use strict";
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
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const upload = (0, multer_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: (process.env.SECRET || ""),
    cookie: {
        maxAge: 1000 * 60 * 60,
        path: "/",
        secure: false
    }
}));
app.use(upload.any());
app.use("/", rt_views_1.default);
app.use("/", rt_controllers_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
