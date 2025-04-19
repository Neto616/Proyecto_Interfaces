"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rt_views_1 = __importDefault(require("./routes/rt_views"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/", rt_views_1.default);
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
