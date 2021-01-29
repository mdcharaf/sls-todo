import { TodoRepository } from "../repos/TodoRepository";
import * as uuid from 'uuid';
{
}
class TodoService {
    constructor(repo) {
        this.repo = repo;
    }
    async createTodoItem(request, userId) {
        const todoId = uuid.v4();
        const item = {
            todoId,
            createdAt: (new Date()).toISOString(),
            name: request.name,
            dueDate: request.dueDate,
            done: false,
            attachmentUrl: request.attachmentUrl,
            userId
        };
        return this.repo.create(item);
    }
    async updateTodoItem(request, todoId, userId) {
        const item = {
            todoId,
            createdAt: (new Date()).toISOString(),
            name: request.name,
            dueDate: request.dueDate,
            done: request.done,
            attachmentUrl: request.attachmentUrl,
            userId
        };
        return this.repo.update(item);
    }
    async deleteTodoItem(todoId, userId) {
        return this.repo.delete(todoId, userId);
    }
    async getTodosByUserId(userId) {
        return this.repo.getByUserId(userId);
    }
}
export function createTodoService() {
    return new TodoService(new TodoRepository());
}
//# sourceMappingURL=TodoService.js.map