import 'source-map-support/register'
import { createTodoService, ITodoService } from "../../services/TodoService";
import { getUserIdFromToken} from '../../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItem } from "../../models/TodoItem";
import response from '../response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserIdFromToken(event.headers.Authorization);
  const todoService: ITodoService = createTodoService();

  const result: TodoItem[] = await todoService.getTodosByUserId(userId);

    if (result.length > 0) {
      return response.success(result);
    }

    return response.notFound("User don't have any todos");
}
