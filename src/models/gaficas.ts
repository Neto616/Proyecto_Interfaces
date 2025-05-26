import { FieldPacket } from "mysql2";
import { Connection } from "mysql2/promise";
import { CategoriasGastos, CHART_JS_COLOR_VALUES, CostosIngresos, MethodCostosIngresos } from '../types/tipos_graficas';

class Grafica{
    public data: Array<CostosIngresos | CategoriasGastos>;
    public colors: (Array<string> | null);
    constructor(data: Array<CostosIngresos | CategoriasGastos>, colors: (Array<string> | null)){
        this.data = data;
        this.colors = colors ?? this.setColors();
    }

    public getData ():Array<CostosIngresos | CategoriasGastos> {
        return this.data;
    }

    public getColors():(Array<string> | null) {
        return this.colors;
    }

    public setColors(): Array<string> {
        const availableColors = CHART_JS_COLOR_VALUES;
        const colorsToAssign: string[] = [];

        for(let i = 0; i<this.data.length; i++){
            const colorIndex = i % availableColors.length;
            colorsToAssign.push(availableColors[colorIndex]);
        } 

        return colorsToAssign;
    }
}

class GraficaService {
    constructor(private connection: Connection){}

    public async getGastosIngresos(userId: number): Promise<MethodCostosIngresos>{
        try {
            const [rows] = await this.connection.execute(`
                SELECT
                    (SELECT SUM(g.cantidad) FROM control_gastos_app.gastos g WHERE g.usuario = ?) AS gasto_total,                    
                    (SELECT SUM(i.cantidad) FROM control_gastos_app.ingresos i WHERE i.id_usuario = ?) AS ingreso_total;`, [userId, userId]) as [CostosIngresos[], FieldPacket[]];
            const result: Grafica = new Grafica((rows || []), ["red", "green"])
            return {
                estatus: 1, info: {
                    message: "Se han traido los calculos de los gastos e ingresos del usuario",
                    data: result
                }};
        } catch (error) {
            console.log(error);
            return { estatus: 0, info: {
                message: "Ha ocurrido un error al traer la información de los gastos y los ingresos del usuario: "+error,
                data: null
            }};
        }
    }

    public async getGastoCategorias(userId: number): Promise<MethodCostosIngresos> {
        try {
            const [rows] = await this.connection.execute(`
                select 
                    sum(g.cantidad) as gasto_total,
                    if( c.titulo is not null,c.titulo, cp.titulo) as categoria_titulo
                from gastos g
                left join gastos_categorias_r gcr on gcr.id_gasto = g.id
                inner join usuarios u on u.id = g.usuario
                left join categorias c on c.id = gcr.id_categoria
                left join categoria_personalizada cp on cp.id = gcr.id_categoria_per and cp.usuario = ?
                where g.usuario = ?
                group by c.titulo, cp.titulo
                `, [userId, userId]) as [CategoriasGastos[], FieldPacket[]];

            const resultado = new Grafica((rows || []), null);
            return {
                estatus: 1, info:{
                    message: "Se han traido los datos de los gastos por categoria del usuario",
                    data: resultado
                }}            
        } catch (error) {
            console.log(error);
            return { estatus: 0, info: {
                message: "Se ha traido los calculos de los gastos por categoria",
                data: null
            }}
        }
    }
}

export {
    Grafica,
    GraficaService
}