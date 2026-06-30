import type { Request, Response } from 'express';
import {WeatherService} from '../services/weather.service.ts';

export class WeatherController {
    static async getWeatherData(req: Request, res: Response): Promise<void> {
        try {
            const { q } = req.query ;

            if(!q){
                  res.status(400).json({ 
                    success: false,
                    message: "Query parameter 'q' is required"
                });
            }
            const data = await WeatherService.fetchWeatherData(q as string);
            res.json({ success: true, data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false,
                message: 'Failed to fetch weather data',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}