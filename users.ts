import {Callback, Handler} from 'aws-lambda';
import {SQS} from 'aws-sdk';
const request = require('request');

const QUEUE_URL = 'https://sqs.ap-southeast-2.amazonaws.com/067508173724/extended-users	';

// Lambda to get the list of users from an SQS queue and write it to Mongo DB.
export const writeToDB: Handler = (event, context, callback: Callback) => {
    const sqs = new SQS({region : 'ap-southeast-2'});
    const params: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: QUEUE_URL,
        AttributeNames: ["All"],
    };
    sqs.receiveMessage(params, (err, data: SQS.Types.ReceiveMessageResult) => {
        if (err) {
            console.log('error:',"Fail Receive Message" + err);
            return callback(new Error("SQS receive failed"));
        } else {
            console.log(data.Messages);
            // data.Messages.sort((m1: SQS.Message, m2: SQS.Message) => m1.MessageAttributes);
            if (data.Messages) {
                // data.Messages.forEach(message => {
                //     if (message.ReceiptHandle) {
                //         const params: SQS.Types.DeleteMessageRequest = {
                //             QueueUrl: QUEUE_URL,
                //             ReceiptHandle: message.ReceiptHandle
                //         };
                //         sqs.deleteMessage(params);
                //     }
                // });
            }
            return callback(undefined, "Hello World");
        }
    });
};

// Lambda to get the list of users from pastebin and stick it on a queue to be processed.
export const readFromPastebin: Handler = (event, context, callback: Callback) => {
    const sqs = new SQS({region : 'ap-southeast-2'});
    request("https://pastebin.com/raw/BvvdxzcH", (error, response, body) => {
        if (error) {
            console.log("Retrieve-user-list failed: " + error);
            return callback(new Error(error));
        }
        const params: SQS.Types.SendMessageRequest = {
            'MessageBody': body,
            'QueueUrl': QUEUE_URL
        };
        sqs.sendMessage(params, (err, data: SQS.Types.SendMessageResult) => {
            if (err) {
                console.log('error:',"Fail Send Message" + err);
                return callback(new Error("SQS send failed"));
            } else {
                return callback(undefined, data.MessageId);
            }
        });
    });
};
