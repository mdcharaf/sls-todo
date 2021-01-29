import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserIdFromToken} from '../../auth/utils'
import response from '../response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event', event);
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserIdFromToken(event.headers.Authorization);
  const todoService: ITodoService = createTodoService();

  const result = await todoService.createTodoItem(newTodo, userId);

  return response.created(result);
}
