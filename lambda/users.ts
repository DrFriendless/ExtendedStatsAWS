import {Callback, Handler} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {IncomingMessage} from "https";
import {getConfig} from "./config";
import {ensureUser} from "./mongo";
const https = require('https');

// Lambda to get the list of users from an SQS queue and write it to Mongo DB.
export const writeToDB: Handler = (event, context, callback: Callback) => {
    // const SnsMessageId = event.Records[0].Sns.MessageId;
    // const SnsPublishTime = event.Records[0].Sns.Timestamp;
    // const SnsTopicArn = event.Records[0].Sns.TopicArn;
    const body = event.Records[0].Sns.Message;
    console.log(body);
    const usernames = body.split(/\r?\n/);
    getConfig(config => {
        usernames.forEach((username: string) => {
            ensureUser(config, username);
        });
    });
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
