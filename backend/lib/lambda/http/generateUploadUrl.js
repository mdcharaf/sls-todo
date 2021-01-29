import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import Response from '../response';
const bucketName = process.env.S3_BUCKET;
const s3 = new AWS.S3({
    signatureVersion: 'v4',
});
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    const presignedUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 300
    });
    return Response.success({ uploadUrl: presignedUrl });
};
//# sourceMappingURL=generateUploadUrl.js.map