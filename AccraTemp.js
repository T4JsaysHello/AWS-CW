"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const moment = require('moment');
//Axios will handle HTTP requests to web service
const axios = require('axios');
//Reads keys from .env file
const dotenv = require('dotenv');
//Set the End point
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
//Copy variables in file into environment variables
dotenv.config();
const WeatherCollector_1 = require("./WeatherCollector");
const dynamoClient = new AWS.DynamoDB.DocumentClient();
function getMeteoDataAccra(dateToStart, daysToCheck) {
    return __awaiter(this, void 0, void 0, function* () {
        let date = moment(dateToStart);
        //Create instance of Fixer.io class
        let meteo = new WeatherCollector_1.WeatherCollector();
        //Array to hold promises
        let promiseArray = [];
        //Create different Locations to be called
        let cityName = "Accra";
        //Work forward from start date
        for (let i = 0; i < daysToCheck; ++i) {
            //Add axios promise to array
            promiseArray.push(meteo.getCityMaxWeather(date.format("YYYY-MM-DD"), 5.6037, 0.1870));
            //Increase the number of days
            date.add(1, 'days');
        }
        try {
            let resultArray = yield Promise.all(promiseArray);
            //Output the data
            resultArray.forEach((result) => {
                // console.log(result);
                //data contains the body of the web service response
                let data = result.data;
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
                };
                dynamoClient.put(params, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    }
                    else {
                        console.log("Success", data);
                    }
                });
                //Output the result - you should put this data in the database
                console.log("Date: " + data.daily.time +
                    " " + data.latitude + " " + data.longitude + " " +
                    "Temp:" + data.daily.temperature_2m_max + " " +
                    "TimeZone:" + " " + data.timezone +
                    " " + data.timezone_abbreviation + " " + unixTime);
            });
        }
        catch (error) {
            console.log("Error: " + JSON.stringify(error));
            console.log("not registered");
        }
    });
}
getMeteoDataAccra('2021-04-15', 100);
