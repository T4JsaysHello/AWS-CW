//This is a backup for the lambda function of processing data then sending them to a new database
import pkg from '@aws-sdk/client-comprehend';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const { ComprehendClient, DetectSentimentCommand } = pkg;
const comprehendClient = new ComprehendClient();
const dynamoDBClient = new DynamoDBClient();

export const handler = async(event) => {
    // console.log(JSON.stringify(event));

    for(let record of event.Records){
        if(record.eventName === "INSERT"){
            console.log("TEXT: " + record.dynamodb.NewImage.Title.S)

            const params ={
                LanguageCode: "en",
                Text: record.dynamodb.NewImage.Title.S,
            };

            const txtData = record.dynamodb.NewImage.Title.S;
            const txtCity = record.dynamodb.Keys.CityName.S;
            const txtTS = record.dynamodb.Keys.WeatherTimeStamp.N;
            const detectSentimentCommand = new DetectSentimentCommand(params);
            const result = await comprehendClient.send(detectSentimentCommand);

            const sentiment = result.Sentiment;
            const sentimentScore = result.SentimentScore;

            console.log(JSON.stringify(result.Sentiment));
            console.log(JSON.stringify(result.SentimentScore));

            const textSentimentParams = {
                TableName: "TextSentiment",
                Item: {
                    "CityName": {"S": txtCity},
                    "WeatherTimeStamp": {"N": txtTS},
                    "Text": {"S": txtData},
                    "Sentiment": {"S": sentiment},
                    "SentimentScore": {"S": JSON.stringify(sentimentScore)}
                }
            };

            const putItemCommand = new PutItemCommand(textSentimentParams);
            await dynamoDBClient.send(putItemCommand);

        }
    }

};
