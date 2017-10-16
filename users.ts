import {Callback, Handler} from 'aws-lambda';
import {SQS, SNS} from 'aws-sdk';
const request = require('request');

// Lambda to get the list of users from an SQS queue and write it to Mongo DB.
export const writeToDB: Handler = (event, context, callback: Callback) => {
    // const sqs = new SQS({region : process.env.AWS_REGION});
    // const params: SQS.Types.ReceiveMessageRequest = {
    //     QueueUrl: process.env.QUEUE_URL,
    //     AttributeNames: ["All"],
    // };
    // sqs.receiveMessage(params, (err, data: SQS.Types.ReceiveMessageResult) => {
    //     if (err) {
    //         console.log('error:',"Fail Receive Message" + err);
    //         return callback(new Error("SQS receive failed"));
    //     } else {
    //         console.log(data.Messages);
    //         if (data.Messages) {
    //             data.Messages.forEach(message => {
    //                 if (message.ReceiptHandle) {
    //                     const params: SQS.Types.DeleteMessageRequest = {
    //                         QueueUrl: process.env.QUEUE_URL,
    //                         ReceiptHandle: message.ReceiptHandle
    //                     };
    //                     sqs.deleteMessage(params);
    //                 }
    //             });
    //         }
    //     }
    // });
    console.log(event);
};

// Lambda to get the list of users from pastebin and stick it on a queue to be processed.
export const readFromPastebin: Handler = (event, context, callback: Callback) => {
    // const sqs = new SQS({region : process.env.AWS_REGION});
    const snsEndpoint = process.env.SNS_ENDPOINT;
    const sns = new SNS();
    request("https://pastebin.com/raw/BvvdxzcH", (error, response, body) => {
        if (error) {
            console.log("Retrieve-user-list failed: " + error);
            return callback(new Error(error));
        }
        sns.publish({
            Message: body,
            TargetArn: snsEndpoint
        }, function(err, data) {
            if (err) {
                console.log(err.stack);
                return;
            }
            console.log('push sent');
            console.log(data);
        });
        // const params: SQS.Types.SendMessageRequest = {
        //     'MessageBody': body,
        //     'QueueUrl': process.env.QUEUE_URL
        // };
        // sqs.sendMessage(params, (err, data: SQS.Types.SendMessageResult) => {
        //     if (err) {
        //         console.log('error:',"Fail Send Message" + err);
        //         return callback(new Error("SQS send failed"));
        //     }
        // });
    });
};
