import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserIdFromToken} from '../../auth/utils'
import * as AWS from 'aws-sdk';
import response from '../../models/response';
const tableName = process.env.TODO_TABLE;
const dbClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const token = event.headers.Authorization;
  const userId = getUserIdFromToken(token);

  await dbClient.update({
    TableName: tableName,
    Key: {
      'todoId': todoId,
      'userId': userId
    },
    UpdateExpression: 'set #name=:n, #done=:d, #dueDate=:dt',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#done': 'done',
      '#dueDate': 'dueDate',
    },
    ExpressionAttributeValues: {
      ":n": updatedTodo.name,
      ":d": updatedTodo.done,
      ":dt": updatedTodo.dueDate
    },
  }).promise();

  return response.success();
}
