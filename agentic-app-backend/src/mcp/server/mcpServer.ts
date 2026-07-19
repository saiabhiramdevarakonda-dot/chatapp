import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCustomerTools } from "./tools/customer.tool.ts";
import { registerOrderTools } from "./tools/order.tool.ts";
import { registerWeatherTools } from "./tools/weather.tool.ts";
import { registerRagTool } from "./tools/rag.tool.ts";

export function createMcpServer() {
    console.log('Creating MCP server Instance...');
    const server = new McpServer({
        name:'agentic-app',
        version:'1.0.0',
    });

    //register tools
    registerCustomerTools(server);
    registerOrderTools(server);
    registerWeatherTools(server);
    registerRagTool(server);

    return server;
}