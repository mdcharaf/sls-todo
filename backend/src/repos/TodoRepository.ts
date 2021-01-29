import * as AWS from 'aws-sdk';
import { TodoItem } from "../models/TodoItem";

export interface ITodoRepoistory {
  create(item: TodoItem): Promise<TodoItem>;
  update(item: TodoItem): Promise<TodoItem>;
  delete(todoId: string, userId: string):Promise<boolean>;
  getByUserId(userId: string): Promise<TodoItem[]>;
}

export class TodoRepository implements ITodoRepoistory {
  private readonly tableName: string;
  private readonly dbClient: AWS.DynamoDB.DocumentClient;
  private readonly todoIndexName: string;

  constructor() {
    this.tableName = process.env.TODO_TABLE;
    this.dbClient = new AWS.DynamoDB.DocumentClient();
    this.todoIndexName = process.env.TODO_INDEX;
  }

  async create(item: TodoItem): Promise<TodoItem> {
    await this.dbClient.put({
      TableName: this.tableName,
      Item: item
    }).promise();

    return item;
  }

  async update(item: TodoItem): Promise<TodoItem> {
    await this.dbClient.update({
      TableName: this.tableName,
      Key: {
        'todoId': item.todoId,
        'userId': item.userId
      },
      UpdateExpression: 'set #name=:n, #done=:d, #dueDate=:dt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#done': 'done',
        '#dueDate': 'dueDate',
      },
      ExpressionAttributeValues: {
        ":n": item.name,
        ":d": item.done,
        ":dt": item.dueDate
      },
    }).promise();

    return item;
  }

  async delete(todoId: string, userId: string): Promise<boolean> {
    await this.dbClient.delete({
      TableName: this.tableName,
      Key: {
        'todoId': todoId,
        'userId': userId
      }
    }).promise();

    return true;
  }

  async getByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.dbClient.query({
      TableName: this.tableName,
      IndexName: this.todoIndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    return result.Items as TodoItem[];
  }
}
