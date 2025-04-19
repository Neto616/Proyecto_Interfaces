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
const express_1 = __importDefault(require("express"));
const rt_views_1 = __importDefault(require("./routes/rt_views"));
const gastos_1 = require("./models/gastos");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/", rt_views_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = new gastos_1.Gasto(100, null, 1, 4);
    const pruebaDB = new gastos_1.GastoRepository();
    // console.log(await pruebaDB.create(prueba))
    console.log(yield pruebaDB.update(prueba, 6));
    console.log(yield pruebaDB.delete(6));
    console.log(JSON.stringify(yield pruebaDB.getAll(prueba)));
}))();
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
