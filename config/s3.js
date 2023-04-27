const { S3Client } = require("@aws-sdk/client-s3");
  
const s3Config = {
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    }
};
  
const s3 = new S3Client(s3Config);

module.exports = s3