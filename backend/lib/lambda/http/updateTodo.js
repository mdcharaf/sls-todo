import 'source-map-support/register';
import { createTodoService } from "../../services/TodoService";
import { getUserIdFromToken } from '../../auth/utils';
import response from '../response';
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo = JSON.parse(event.body);
    const token = event.headers.Authorization;
    const userId = getUserIdFromToken(token);
    const todoService = createTodoService();
    return response.success();
};
//# sourceMappingURL=updateTodo.js.map