import 'source-map-support/register';
import { createTodoService } from "../../services/TodoService";
import { getUserIdFromToken } from '../../auth/utils';
import response from '../response';
export const handler = async (event) => {
    console.log('Processing Event', event);
    const newTodo = JSON.parse(event.body);
    const userId = getUserIdFromToken(event.headers.Authorization);
    const todoService = createTodoService();
    const result = await todoService.createTodoItem(newTodo, userId);
    return response.created(result);
};
//# sourceMappingURL=createTodo.js.map