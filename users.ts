import {Callback, Handler} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {IncomingMessage} from "https";
const https = require('https');

// Lambda to get the list of users from an SQS queue and write it to Mongo DB.
export const writeToDB: Handler = (event, context, callback: Callback) => {
    console.log(event);
    const SnsMessageId = event.Records[0].Sns.MessageId;
    console.log(SnsMessageId);
    const SnsPublishTime = event.Records[0].Sns.Timestamp;
    console.log(SnsPublishTime);
    const SnsTopicArn = event.Records[0].Sns.TopicArn;
    console.log(SnsTopicArn);
    const body = event.Records[0].Sns;
    console.log(body);
};

// Lambda to get the list of users from pastebin and stick it on a queue to be processed.
export const readFromPastebin: Handler = (event, context, callback: Callback) => {
    // const sqs = new SQS({region : process.env.AWS_REGION});
    const snsEndpoint = process.env.SNS_ENDPOINT;
    const sns = new SNS();
    const data: Buffer[] = [];

    https.get("https://pastebin.com/raw/BvvdxzcH", (response: IncomingMessage) => {
        response.on('error', (err: Error) => { return callback(err) });
        response.on('data', (chunk: Buffer) => data.push(chunk));
        response.on('end', () => {
            const body = Buffer.concat(data).toString();
            console.log(body);
            sns.publish({
                Message: body,
                TargetArn: snsEndpoint
            }, function(err, data) {
                if (err) {
                    console.log(err.stack);
                    return;
                }
                console.log('Sent to SNS');
                console.log(data);
            });
        });
    });

};
