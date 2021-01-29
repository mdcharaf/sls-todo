import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { getUserIdFromToken } from '../../auth/utils'
import { createCloudWatchService, ICloudWatchService } from "../../services/cloudwatchService";
import response from '../response'

const cloudWatchService: ICloudWatchService = createCloudWatchService();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event', event);
  await cloudWatchService.recordRequestsCount();

  try {
    const todoId = event.pathParameters.todoId
    const token = event.headers.Authorization;
    const userId = getUserIdFromToken(token);
    const todoService: ITodoService = createTodoService();

    await todoService.deleteTodoItem(todoId, userId);

    return response.success();
  } catch (error) {
    return response.badRequest(error.message);
  }
}
