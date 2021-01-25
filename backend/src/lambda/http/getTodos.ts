import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import Response from '../../models/response'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoTableName = process.env.TODO_TABLE;
  const dbContext = new AWS.DynamoDB.DocumentClient();

  return undefined;
}
