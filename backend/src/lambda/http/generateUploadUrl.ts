import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import Response from '../../models/response';

const bucketName = process.env.S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
  });

  const todoId = event.pathParameters.todoId
  const presignedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: 300
  });

  return Response.success({ uploadUrl: presignedUrl });
}
