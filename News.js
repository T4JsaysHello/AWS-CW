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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
//Use Node module for accessing newsapi
const NewsAPI = require('newsapi');
//Module that reads keys from .env file
const dotenv_1 = __importDefault(require("dotenv"));
//Copy variables in file into environment variables
dotenv_1.default.config();
//Set the End point
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
//Create new NewsAPI class
const newsapi = new NewsAPI(process.env.NEWS_API);
const dynamoClient = new AWS.DynamoDB.DocumentClient();
let cityName = "Berlin";
//Pulls and logs data from API
function getNews() {
    return __awaiter(this, void 0, void 0, function* () {
        //Search API
        const result = yield newsapi.v2.everything({
            q: 'london-weather',
            pageSize: 100,
            language: 'en',
            from: '2023-02-29',
            to: '2023-03-30'
        });
        //Output article titles and dates 
        console.log(result.articles.length);
        for (let article of result.articles) {
            const date = new Date(article.publishedAt);
            let params = {
                TableName: "Textdata",
                Item: {
                    CityName: cityName,
                    WeatherTimeStamp: date.getTime(),
                    SourceName: article.source.Name,
                    Title: article.title
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
            console.log("Unix Time: " + date.getTime() + "; title: " + article.title + " " + article.source.Name);
        }
    });
}
getNews();
