import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { getUserIdFromToken} from '../../auth/utils'
import response from '../response';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const token = event.headers.Authorization;
  const userId = getUserIdFromToken(token);
  const todoService: ITodoService = createTodoService();

  await todoService.deleteTodoItem(todoId, userId);

  return response.success();
}
