import express, { Router, Request, Response } from "express";

const route: Router = express.Router();

route.get("/", (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

export default route;