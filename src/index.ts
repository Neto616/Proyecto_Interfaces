import express from 'express';
import { default as vista } from './routes/rt_views';
import { CategoriaRepository } from './models/categorias';

const app = express();
const port = process.env.PORT || 3000;

app.use("/", vista);

(async()=> {
    const categoria: CategoriaRepository = new CategoriaRepository();
    // const result = await categoria.getAll(4)
    // console.log(result.info["data"])
})()

app.listen(port, ()=> {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
