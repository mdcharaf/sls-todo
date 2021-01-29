import { ITodoRepoistory, TodoRepository } from "../repos/TodoRepository";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk'

const logger = createLogger('TodoService')

export interface ITodoService {
  createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem>;
  updateTodoItem(request: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem>;
  getTodosByUserId(userId: string): Promise<TodoItem[]>;
  deleteTodoItem(todoId: string, userId: string): Promise<boolean>;
  createAttachementPresignedUrl(todoId: string, bucket: string): string;
}

class TodoService implements ITodoService {
  private readonly repo: ITodoRepoistory;
  private readonly s3: AWS.S3;

  constructor(repo: ITodoRepoistory) {
    this.repo = repo;
    this.s3 = new AWS.S3({ signatureVersion: 'v4' });
  }

  async createTodoItem(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
    if (!request.name) {
      throw new Error('Missing todo name');
    }
    if (isNaN(Date.parse(request.dueDate))) {
      throw new Error('Invalid Date Format');
    }

    const todoId = uuid.v4();
    const bucketUrl = process.env.S3_BUCKET_URL;
    const item: TodoItem = {
      todoId,
      createdAt: (new Date()).toISOString(),
      name: request.name,
      dueDate: request.dueDate,
      done: false,
      attachmentUrl: `${bucketUrl}/${todoId}`,
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
      userId: userId,
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

  createAttachementPresignedUrl(todoId: string, bucket: string): string {
    const presignedUrl = this.s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: todoId,
      Expires: 300
    });

    return presignedUrl;
  }
}

export function createTodoService(): ITodoService {
  return new TodoService(new TodoRepository());
}
