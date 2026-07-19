import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { WeatherService } from "../../../services/weather.service.ts";

export function registerWeatherTools(mcpServer: McpServer) {
    console.log("Registering weather tools");

    mcpServer.registerTool(
        "get_live_weather_by_city",
        {
            title: "Get Live Weather By City",
            description: "Retrieve the live weather data of a city from external API",

            inputSchema: {
                city: z.string(),
                country: z.string().optional(),
            },

            outputSchema: {
                weather: z.any(),
            },
        },

        async ({ city, country }) => {
            const query = country
                ? `${city},${country}`
                : city;

            const data = await WeatherService.fetchWeatherData(query);

           

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
                structuredContent: {
                    weather: data,
                },
            };
        }
    );
}