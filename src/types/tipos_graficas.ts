import { Grafica } from "../models/gaficas"
enum estatus {
    MAL = 0,
    TODO_BIEN = 1,
    NO_COINCIDE = 2
};

export const CHART_JS_COLOR_VALUES: string[] = [
    '#FF6384',  // Red
    '#36A2EB',  // Blue
    '#FFCE56',  // Yellow
    '#4BC0C0',  // Green
    '#9966FF',  // Purple
    '#FF9F40',  // Orange
    '#C9CBCF',  // Grey
    '#A13C57',  // Dark Red
    '#226A9E',  // Dark Blue
    '#2E7A7A',  // Dark Green
    // Agrega más colores si es necesario
];

//Queries
export type CostosIngresos = {
    gasto_total: number,
    ingreso_total: number
}

export type CategoriasGastos = {
    gasto_total: number,
    categoria_titulo: string
}

//Methods
export type MethodCostosIngresos = {
  estatus: estatus,
  info: {
    message: string,
    data: Grafica | null
  }  
}
