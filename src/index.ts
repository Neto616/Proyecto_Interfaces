import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import multer from 'multer';
import session from "express-session";
import { default as vista } from './routes/rt_views';
import { default as controller } from './routes/rt_controllers';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: (process.env.SECRET || ""),
    cookie: {
        maxAge: 1000 * 60 * 60,
        path: "/",
        secure: false
    }
}))
app.use(upload.any());
app.use("/", vista);
app.use("/", controller);


app.listen(port, ()=> {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
