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
exports.GastoRepository = exports.Gasto = void 0;
const db_1 = __importDefault(require("./db"));
class Gasto {
    constructor(cantidad) {
        this.cantidad = cantidad;
    }
    getGasto() {
        return this.cantidad;
    }
    setGasto(cantidad) {
        this.cantidad = cantidad;
    }
}
exports.Gasto = Gasto;
class GastoRepository extends db_1.default {
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.GastoRepository = GastoRepository;
