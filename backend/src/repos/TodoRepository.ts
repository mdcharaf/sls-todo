import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from "../models/TodoItem";

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodoRepo');

export interface ITodoRepoistory {
  create(item: TodoItem): Promise<TodoItem>;
  update(item: TodoItem): Promise<TodoItem>;
  delete(todoId: string, userId: string): Promise<boolean>;
  getByUserId(userId: string): Promise<TodoItem[]>;
  get(userId: string, todoId: string): Promise<TodoItem>;
  exists(userId: string, todoId: string): Promise<boolean>;
}

export class TodoRepository implements ITodoRepoistory {
  private readonly tableName: string;
  private readonly dbClient: DocumentClient;
  private readonly todoIndexName: string;

  constructor() {
    this.tableName = process.env.TODO_TABLE;
    this.dbClient = new XAWS.DynamoDB.DocumentClient();
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

  async get(userId: string, todoId: string): Promise<TodoItem> {
    logger.info('Start Get by partition key');
    const result = await this.dbClient.get({
      TableName: this.tableName,
      Key: {
        'userId': userId,
        'todoId': todoId
      }
    }).promise();

    logger.info('Get by partition key', result);
    return result.Item as TodoItem;
  }

  async exists(userId: string, todoId: string): Promise<boolean> {
    const item: TodoItem =  await this.get(userId, todoId);

    return item?.todoId !== null && item?.todoId !== undefined;
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
