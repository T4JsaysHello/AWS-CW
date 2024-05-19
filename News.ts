const AWS = require('aws-sdk');

//Use Node module for accessing newsapi
const NewsAPI = require('newsapi');

//Module that reads keys from .env file
import dotenv from 'dotenv';  

//Copy variables in file into environment variables
dotenv.config();

//Set the End point
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

//Create new NewsAPI class
const newsapi = new NewsAPI(process.env.NEWS_API);

const dynamoClient = new AWS.DynamoDB.DocumentClient();

//Define structure of data returned from NewsAPI
interface Article {
    title:string,
    publishedAt:string,
    source: SourceNewsDetails
}

interface SourceNewsDetails {

    Name: string

}
//Define structure of data returned from NewsAPI
interface NewsAPIResult {
    articles:Array<Article>
}
let cityName: string = "Berlin"
//Pulls and logs data from API
async function getNews():Promise<void>{
    //Search API

    const result:NewsAPIResult = await newsapi.v2.everything({
        q: 'london-weather',
        pageSize: 100,
        language: 'en',
        from: '2023-02-29',
        to: '2023-03-30'
    });

    //Output article titles and dates 
    console.log(result.articles.length);
    for(let article of result.articles){
        const date = new Date(article.publishedAt);

        let params = {
            TableName: "Textdata",
            Item: {
                CityName: cityName,
                WeatherTimeStamp: date.getTime(),
                SourceName: article.source.Name,
                Title: article.title
            }
        }

        dynamoClient.put(params, function(err: any, data: any) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });

        console.log("Unix Time: " + date.getTime() + "; title: " + article.title + " " + article.source.Name);
    }

}

getNews();

