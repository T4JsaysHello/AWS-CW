let AWS = require("aws-sdk");

//Import functions for database
let db = require('database');

module.exports.getSendMessagePromises = async (domainName, stage, conId) => {
    //Create API Gateway management class.
    let dataSet = (await db.getTempData()).Items;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domainName + '/' + stage
    });

    try {


        //Create parameters for API Gateway
        let apiMsg = {
            ConnectionId: conId,
            Data: JSON.stringify(dataSet)
        };

        //Wait for API Gateway to execute and log result
        await apigwManagementApi.postToConnection(apiMsg).promise();
        console.log("Message '" + message + "' sent to: " + conId);
    } catch (err) {
        console.log("Failed to send message to: " + conId);

        //Delete connection ID from database
        if (err.statusCode == 410) {
            try {
                await db.deleteConnectionId(conId);
            } catch (err) {
                console.log("ERROR deleting connectionId: " + JSON.stringify(err));
                throw err;
            }
        } else {
            console.log("UNKNOWN ERROR: " + JSON.stringify(err));
            throw err;
        }
    }
};
