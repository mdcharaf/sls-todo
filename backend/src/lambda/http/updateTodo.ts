import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { getUserIdFromToken } from '../../auth/utils'
import response from '../response';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const token = event.headers.Authorization;
    const userId = getUserIdFromToken(token);
    const todoService: ITodoService = createTodoService();

    const result = await todoService.updateTodoItem(updatedTodo, todoId, userId);

    return response.success(result);
  } catch (error) {
    return response.badRequest(error.message);
  }
}
