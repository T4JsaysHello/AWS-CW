//Time library that we will use to increment dates.
import {json} from "stream/consumers";

const AWS = require('aws-sdk');


const moment = require('moment');

//Axios will handle HTTP requests to web service
const axios = require ('axios');

//Reads keys from .env file
const dotenv = require('dotenv');

//Set the End point
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

//Copy variables in file into environment variables
dotenv.config();

import {WeatherCollector} from "./WeatherCollector";

const dynamoClient = new AWS.DynamoDB.DocumentClient();
async function getMeteoDataLondon(dateToStart: string, daysToCheck: number) {

    let date = moment(dateToStart);

    //Create instance of Fixer.io class
    let meteo: WeatherCollector = new WeatherCollector();

    //Array to hold promises
    let promiseArray: Array<Promise<object>> = [];

    //Create different Locations to be called

    let cityName: string = "London"

    let unixTimeStamp: number;
    //Work forward from start date


        for (let i: number = 0; i < daysToCheck; ++i) {
            //Add axios promise to array
            promiseArray.push(meteo.getCityMaxWeather(date.format("YYYY-MM-DD"), 51.5072, 0.1276));


            //Increase the number of days
            date.add(1, 'days');
        }



    try {
        let resultArray: Array<object> = await Promise.all(promiseArray);

        //Output the data
        resultArray.forEach((result) => {
            // console.log(result);
            //data contains the body of the web service response
            let data: WeatherObject = (result as { data: WeatherObject }).data;
            let dateMoment = moment(data.daily.time, "YYYY-MM-DD");
            let unixTime = dateMoment.unix();

            //Table name and data for table
            let params = {
                TableName: "Weather",
                Item: {
                    CityName: cityName,
                    WeatherTimeStamp: unixTime,
                    Temperature: data.daily.temperature_2m_max,
                }
            }

            dynamoClient.put(params, function(err: any, data: any) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data);
                }
            });



                //Output the result - you should put this data in the database
                console.log("Date: " + data.daily.time +
                            " " + data.latitude + " " + data.longitude + " " +
                            "Temp:" + data.daily.temperature_2m_max + " " +
                            "TimeZone:" + " " + data.timezone +
                            " " + data.timezone_abbreviation + " " + unixTime
                );
        });
    }

    catch(error){
        console.log("Error: " + JSON.stringify(error));
        console.log("not registered")
    }
}



getMeteoDataLondon('2021-04-15', 100);




