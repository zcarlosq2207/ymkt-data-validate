"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
function getS3Object(fileName) {
    console.log('Downloading consultants file...');
    const region = process.env.INPUT_BUCKET_REGION;
    const accessKeyId = process.env.INPUT_BUCKET_ACCESS_KEY_ID;
    const secretAccessKey = process.env.INPUT_BUCKET_SECRET_ACCESS_KEY;
    const bucket = process.env.INPUT_BUCKET_NAME;
    const key = fileName;
    const config = new aws_sdk_1.Config({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });
    let s3 = new aws_sdk_1.S3(config);
    let params = {
        Bucket: bucket,
        Key: key,
    };
    console.log(`Getting Object ${key} from S3`);
    const rs = s3.getObject(params).createReadStream();
    const { chain } = require('stream-chain');
    const { parser } = require('stream-json');
    const { streamValues } = require('stream-json/streamers/StreamValues');
    const s3Pipeline = chain([
        rs,
        parser(),
        streamValues(),
        data => {
            return data.value;
        }
    ]);
    return s3Pipeline;
}
exports.getS3Object = getS3Object;
//# sourceMappingURL=index.js.map