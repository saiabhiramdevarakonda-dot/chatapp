import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
class MCPClientService{
    private static instance: MCPClientService;
    private intialised = false;
    client: Client;
    tools: any[] = [];
    constructor() {
        this.client = new Client({
          name: 'node-mcp-client',
          version: '1.0.0',
        })
    }
  static getInstance(): MCPClientService{
    if(!this.instance){
        this.instance = new MCPClientService();
    }
    return this.instance
  }
   async init(): Promise<MCPClientService>{
    if(this.intialised) return this;

     const url = `${process.env.SERVER}:${process.env.PORT}/mcp`;
     const transport = new StreamableHTTPClientTransport(new URL(url));
     
     await this.client.connect(transport);
     this.intialised = true;
     return this;
   }

   async getTools(){
      await this.init();
      if(this.tools.length === 0){
        const list = await this.client.listTools();
        this.tools = list.tools;

      }
     return this.tools;
   }
   async callTool(name: string,args: Record<string, any>){
    if(!this.intialised) await this.init();
     return await this.client.callTool({
      name,
      arguments: args
     });
   }
  }
export const MCPClient = MCPClientService.getInstance();

