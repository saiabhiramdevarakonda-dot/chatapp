export class WeatherService {
    static async fetchWeatherData(city: string): Promise<any> {
        const apikey = process.env.WEATHER_API_KEY;
        const url = `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${encodeURIComponent(city)}&aqi=no}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response?.statusText}`);
        }
        const data = await response.json();
        return data;
    }
}