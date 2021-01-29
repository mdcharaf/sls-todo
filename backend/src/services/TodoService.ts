import { ITodoRepoistory, TodoRepository } from "../repos/TodoRepository";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid';

const logger = createLogger('TodoService')

export interface ITodoService {
  createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem>;
  updateTodoItem(request: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem>;
  getTodosByUserId(userId: string): Promise<TodoItem[]>;
  deleteTodoItem(todoId: string, userId: string): Promise<boolean>;
}

class TodoService implements ITodoService {
  private readonly repo: ITodoRepoistory;

  constructor(repo: ITodoRepoistory) {
    this.repo = repo;
  }

  async createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4();

    const item: TodoItem = {
      todoId,
      createdAt: (new Date()).toISOString(),
      name: request.name,
      dueDate: request.dueDate,
      done: false,
      attachmentUrl: request.attachmentUrl,
      userId
    };

    logger.info('Todo item created', { item });
    return this.repo.create(item);
  }

  async updateTodoItem(request: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
    const item: TodoItem = {
      todoId,
      createdAt: (new Date()).toISOString(),
      name: request.name,
      dueDate: request.dueDate,
      done: request.done,
      userId: userId
    };

    logger.info('Todo item updated', { item });
    return this.repo.update(item);
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<boolean> {
    this.repo.delete(todoId, userId);
    logger.info('Todo item deleted', { todoId });
    return true;
  }

  async getTodosByUserId(userId: string): Promise<TodoItem[]> {
    return this.repo.getByUserId(userId);
  }
}

export function createTodoService(): ITodoService {
  return new TodoService(new TodoRepository());
}