import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserIdFromToken} from '../../auth/utils'
import * as AWS from 'aws-sdk';
import response from '../response';
const tableName = process.env.TODO_TABLE;
const dbClient = new AWS.DynamoDB.DocumentClient();


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const token = event.headers.Authorization;
  const userId = getUserIdFromToken(token);

  await dbClient.delete({
    TableName: tableName,
    Key: {
      'todoId': todoId,
      'userId': userId
    }
  }).promise();

  return response.success();
}
