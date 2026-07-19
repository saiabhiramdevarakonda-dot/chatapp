import {WeatherController} from "../controllers/weather.controller.ts";

import express from 'express';

const router = express.Router();

router.get('/', WeatherController.getWeatherData);

export default router;