import express from 'express';
import { default as vista } from './routes/rt_views';
import Usuario from './models/usuarios';

const app = express();
const port = process.env.PORT || 3000;

app.use("/", vista);

(async()=>{
    const prueba: Usuario = new Usuario("basn160603@gmail.com", "123456", "Nestor", "Balderas S");
    console.log(await prueba.existUser());
    // console.log(await prueba.deleteUer(2));
    // console.log(await prueba.createUser())
})()

app.listen(port, ()=> {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
