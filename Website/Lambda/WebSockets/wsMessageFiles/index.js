//Import external library with websocket functions
let ws = require('websocket');

//Hard coded domain name and stage - use when pushing messages from server to client
let domainName = "wss://2vn1tu4oo8.execute-api.us-east-1.amazonaws.com";
let stage = "prod";

exports.handler = async (event) => {
    try {
        const conId = event.requestContext.connectionId;

        //Allocate domain name and stage dynamically
        domainName = event.requestContext.domainName;
        stage = event.requestContext.stage;
        console.log("Domain: " + domainName + " stage: " + stage);

        //Get promises to send messages to connected clients
        let sendMsgPromises = await ws.getSendMessagePromises(domainName, stage, conId);

        //Execute promises
        await Promise.all(sendMsgPromises);
    }
    catch(err){
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};
