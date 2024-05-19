
interface DailyUnites{
    time: string,
    temperature_2m_max: string
}

interface DailySub{
    time: string,
    temperature_2m_max: number
}


//Weather data
interface WeatherObject {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number,
    daily_units: DailyUnites,
    daily: DailySub

}