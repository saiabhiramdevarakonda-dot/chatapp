import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { createMcpServer } from "../mcp/server/mcpServer.ts";

const mcpServer = createMcpServer();

const USE_SESSIONS = true;

const sessionTransports: Record<string, StreamableHTTPServerTransport> = {};

export class McpServerController {
    private static getSessionTransport(
        sessionId?: string
    ): StreamableHTTPServerTransport | null {
        if (!USE_SESSIONS) return null;

        return sessionId ? sessionTransports[sessionId] ?? null : null;
    }

    private static createTransport(): StreamableHTTPServerTransport {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: USE_SESSIONS ? () => randomUUID() : undefined,
            enableJsonResponse: true,

            onsessioninitialized: (sessionId) => {
                if (USE_SESSIONS) {
                    sessionTransports[sessionId] = transport;
                }
            },
        });

        if (USE_SESSIONS) {
            transport.onclose = () => {
                if (transport.sessionId) {
                    delete sessionTransports[transport.sessionId];
                }
            };
        }

        return transport;
    }

    static async handlePost(req: Request, res: Response) {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;

        let transport = McpServerController.getSessionTransport(sessionId);

        if (USE_SESSIONS) {
            if (!transport && isInitializeRequest(req.body)) {
                transport = McpServerController.createTransport();

                await mcpServer.connect(transport);
            }
        } else {
            transport = this.createTransport();

            await mcpServer.connect(transport);
        }

        if (!transport) {
            return res.status(400).json({
                jsonrpc: "2.0",
                error: {
                    code: -32000,
                    message: "Invalid request",
                },
                id: null,
            });
        }

        await transport.handleRequest(req, res, req.body);
    }

    static async handleGet(req: Request, res: Response) {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;

        if (!sessionId || !sessionTransports[sessionId]) {
            return res.status(400).send("Invalid or missing session ID");
        }

        await sessionTransports[sessionId].handleRequest(req, res);
    }

    static async handleDelete(req: Request, res: Response) {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        const transport = this.getSessionTransport(sessionId);

        if (!transport) {
            return res.status(400).send("Invalid or missing session ID");
            ;
        }
        if (!sessionId || !sessionTransports[sessionId]) {
            return res.status(400).send("Invalid or missing session ID");
        }

        await sessionTransports[sessionId].handleRequest(req, res);
    }
    static async handleOptions(req: Request, res: Response) {
        if(!USE_SESSIONS){
            return res.status(405).send("Method Not Allowed");
        }
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        const transport = McpServerController.getSessionTransport(sessionId);

        if (!transport) {
            return res.status(400).send("Invalid or missing session ID");
            ;
        }
        if (!sessionId || !sessionTransports[sessionId]) {
            return res.status(400).send("Invalid or missing session ID");
        }

        await sessionTransports[sessionId].handleRequest(req, res);
    
    }
}