import express from 'express';
import { default as vista } from './routes/rt_views';
import { CategoriaRepository } from './models/categorias';

const app = express();
const port = process.env.PORT || 3000;

app.use("/", vista);

app.listen(port, ()=> {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
