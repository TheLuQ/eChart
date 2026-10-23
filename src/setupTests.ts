import '@testing-library/jest-dom';
import type { Server } from "http";
import express, { type Request, type Response } from "express";

interface Route {
    sheets: unknown
    titles?: { titles?: { group_key: string; title: string }[]; etag?: string }
}

let activeServer: Server | undefined

export function setupRoutes(setup: Route) {
    const app = express()
    activeServer?.close()
    app.get("/api/bands/:bandId/sheets", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(setup.sheets));
    });
    app.get("/api/bands/:bandId/titles", (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(setup.titles ?? { titles: [] }));
    });
    activeServer = app.listen(3003, () => console.log('SUCCESS!!!'))
}