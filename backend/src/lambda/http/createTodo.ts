import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getToken, getUserIdFromToken} from '../../auth/utils'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import Response from '../../models/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event', event);
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4();
  const dbContext = new AWS.DynamoDB.DocumentClient();
  const todoTableName = process.env.TODO_TABLE;
  const token = event.headers.Authorization;

  const item = {
    todoId,
    createdAt: (new Date()).toISOString(),
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false,
    attachmentUrl: null,
    userId: getUserIdFromToken(token)
  };
  
  await dbContext.put({
    TableName: todoTableName,
    Item: item
  });

  return Response.created(item);
}
