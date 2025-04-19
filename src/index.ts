import express from 'express';
import { default as vista } from './routes/rt_views';
import { Gasto, GastoRepository } from './models/gastos';

const app = express();
const port = process.env.PORT || 3000;

app.use("/", vista);

(async ()=>{
    const prueba: Gasto = new Gasto(100, null, 1, 4);
    const pruebaDB: GastoRepository = new GastoRepository();

    // console.log(await pruebaDB.create(prueba))
    console.log(await pruebaDB.update(prueba, 6))
    console.log(await pruebaDB.delete(6))
    console.log(JSON.stringify(await pruebaDB.getAll(prueba)))
})()

app.listen(port, ()=> {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
