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
    if (!request.name) {
      throw new Error('Missing todo name');
    }
    if (isNaN(Date.parse(request.dueDate))) {
      throw new Error('Invalid Date Format');
    }

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
    return await this.repo.create(item);
  }

  async updateTodoItem(request: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
    if (!(await this.repo.exists(userId, todoId))) {
      throw new Error('Record not found');
    }

    const item: TodoItem = {
      todoId,
      createdAt: (new Date()).toISOString(),
      name: request.name,
      dueDate: request.dueDate,
      done: request.done,
      userId: userId
    };

    await this.repo.update(item);
    logger.info('Todo item updated', { item });
    return item;
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<boolean> {
    if (!(await this.repo.exists(userId, todoId))) {
      throw new Error('Record not found');
    }

    await this.repo.delete(todoId, userId);
    logger.info('Todo item deleted', { todoId });
    return true;
  }

  async getTodosByUserId(userId: string): Promise<TodoItem[]> {
    return await this.repo.getByUserId(userId);
  }
}

export function createTodoService(): ITodoService {
  return new TodoService(new TodoRepository());
}