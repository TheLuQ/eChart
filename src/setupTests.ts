import '@testing-library/jest-dom';
import express, { type Request, type Response } from "express";

interface Route {
    titles: unknown
    instruments: unknown
    sheets: unknown
}

export function setupRoutes(setup: Route) {
    const app = express()
    app.get("/api/titles", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(setup.titles));
    });

    app.get("/api/instruments", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(setup.instruments));
    });

    app.get("/api/sheets", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(setup.sheets));
    });

    app.listen(3003, () => console.log('SUCCESS!!!'))
}