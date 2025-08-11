import '@testing-library/jest-dom';
import express, { type Request, type Response } from "express";
import * as  db from '../docker/back/db.json'


export function setupRoutes() {
    const app = express()
    app.get("/titles", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db.titles));
    });

    app.get("/instruments", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db.instruments));
    });

    app.get("/sheets", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db.sheets));
    });

    app.listen(3003, () => console.log('SUCCESS!!!'))
}