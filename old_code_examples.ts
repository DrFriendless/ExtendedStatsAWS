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

