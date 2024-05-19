const axios = require ('axios');

export class WeatherCollector {
    baseURL: string = "https://archive-api.open-meteo.com/v1/archive?";

    getCityMaxWeather(date: string, latCo: number, lonCo: number): Promise<object> {
        let url: string  =
            this.baseURL +
            "latitude=" +
            latCo +
            "&longitude=" +
            lonCo +
            "&start_date=" +
            date +
            "&end_date=" +
            date +
            "&daily=temperature_2m_max&timezone=auto"

        // console.log("Building meteo data Promise with URL: " + url)

        return axios.get(url);
    }

}