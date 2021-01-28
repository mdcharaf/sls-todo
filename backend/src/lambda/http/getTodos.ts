import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import response from '../../models/response'
import { getUserIdFromToken} from '../../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const dbContext = new AWS.DynamoDB.DocumentClient();
  const todoTableName = process.env.TODO_TABLE;
  const todoIndex = process.env.TODO_INDEX;
  const userId = getUserIdFromToken(event.headers.Authorization);

  const result = await dbContext.query({
      TableName: todoTableName,
      IndexName: todoIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    if (result.Count > 0) {
      return response.success(result.Items);
    }

    return response.notFound("User don't have any todos");
}
