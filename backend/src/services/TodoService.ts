import { ITodoRepoistory, TodoRepository } from "../repos/TodoRepository";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import * as uuid from 'uuid';

export interface ITodoService {
  createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem>;
}

class TodoService implements ITodoService{
  private readonly repo: ITodoRepoistory;

  constructor(repo: ITodoRepoistory) {
    this.repo = repo;
  }

  async createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
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

  async updateTodoItem(item: TodoItem): Promise<TodoItem> {
    return this.repo.update(item);
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<boolean> {
    return this.repo.delete(todoId, userId);
  }

  async getTodosByUserId(userId: string): Promise<TodoItem[]> {
    return this.repo.getByUserId(userId);
  }
}

export function createTodoService(): ITodoService {
  return new TodoService(new TodoRepository());
}