"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherCollector = void 0;
const axios = require('axios');
class WeatherCollector {
    constructor() {
        this.baseURL = "https://archive-api.open-meteo.com/v1/archive?";
    }
    getCityMaxWeather(date, latCo, lonCo) {
        let url = this.baseURL +
            "latitude=" +
            latCo +
            "&longitude=" +
            lonCo +
            "&start_date=" +
            date +
            "&end_date=" +
            date +
            "&daily=temperature_2m_max&timezone=auto";
        // console.log("Building meteo data Promise with URL: " + url)
        return axios.get(url);
    }
}
exports.WeatherCollector = WeatherCollector;
