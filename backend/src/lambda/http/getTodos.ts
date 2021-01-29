import 'source-map-support/register'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { getUserIdFromToken} from '../../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItem } from "../../models/TodoItem";
import { createCloudWatchService, ICloudWatchService } from "../../services/cloudwatchService";
import response from '../response'

const cloudWatchService: ICloudWatchService = createCloudWatchService();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event', event);
  await cloudWatchService.recordRequestsCount();

  const userId = getUserIdFromToken(event.headers.Authorization);
  const todoService: ITodoService = createTodoService();

  const items: TodoItem[] = await todoService.getTodosByUserId(userId);
  return response.success({ items });
}
